import 'dotenv/config';
import express, {
  NextFunction, Request, RequestHandler, Response,
} from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';

import { coreActions } from '@amnis/core/actions';
import { memory } from '@amnis/db/memory';
import { ApiInput, apiAuthProcesses } from '@amnis/api/index';
import { storeSetup } from '@amnis/state/store';

import { databaseSetup } from './database';

const apiInput = (): RequestHandler => (
  (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;

    /**
     * Setup the process input.
     */
    const input: ApiInput = { body };

    req.body = input;

    next();
  }
);

/**
 * Create the server store.
 * The server store contains a cache of roles and tokens needed by the API server.
 */
const serverStore = storeSetup();

/**
 * Setup auth processes.
 */
const authProcesses = apiAuthProcesses({
  store: serverStore,
  database: memory,
});

/**
 * Create an express application to serve static files.
 */
const app = express();
const port = 3000;

/**
 * Output a log all requests with the morgan middleware.
 */
app.use(morgan('dev'));

/**
 * Specify a folder to serve static content from.
 */
app.use(express.static(path.join(__dirname, 'static')));

/**
 * Parse possible JSON content.
 */
app.use(express.json());

/**
 * Enable ability to set and parse cookies.
 */
app.use(cookieParser());

/**
 * Create middleware to form an api input on the reqest object.
 */
app.use(apiInput());

/**
 * Serve the login page as the index.
 */
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'static/login.html'));
});

/**
 * Listen for auth login requests.
 */
app.post('/auth/login', async (req, res) => {
  const output = await authProcesses.login(req.body);

  res.json(output.json);
});

async function init() {
  /**
   * Create the test database with pre-intantiated data.
   */
  await databaseSetup(memory);

  /**
   * Fetch roles from the database and populate the server store.
   * The auth API assigns grants based on roles in the server store; which should
   * be loaded in at startup.
   */
  serverStore.dispatch(coreActions.create(await memory.read({
    role: {},
  }, { role: 'global' })));

  /**
   * Start the service to serve the client files.
   */
  app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
  });
}

init();