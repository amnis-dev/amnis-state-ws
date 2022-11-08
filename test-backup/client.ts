import 'dotenv/config';
import express, {
  NextFunction, Request, RequestHandler, Response,
} from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';

import { coreActions, IoInput } from '@amnis/core';
import { dbmemory } from '@amnis/db';

import { serviceSetup } from './database.js';

const apiInput = (): RequestHandler => (
  (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;

    /**
     * Setup the process input.
     */
    const input: IoInput = { body };

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
const authProcesses = apiIO({
  store: serverStore,
  database: dbmemory,
  validators: validatorsSetup(schemaAuth),
}, apiAuthProcess);

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
 * Set the view engine to ejs
 */
app.set('view engine', 'ejs');

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
app.use('/auth/', apiInput());

/**
 * Serve the login page as the index.
 */
app.get('*', (req, res) => {
  res.render(path.join(__dirname, 'static/login'), {
    microsoftClientId: process.env.MICROSOFT_CLIENT_ID,
    twitterClientId: process.env.TWITTER_CLIENT_ID,
  });
});

/**
 * Listen for auth login requests.
 */
app.post('/auth/login', async (req, res) => {
  const input: IoInput = req.body;
  const output = await authProcesses.login(input);

  res.json(output.json);
});

/**
 * Listen for auth platform requests.
 */
app.post('/auth/platform', async (req, res) => {
  const input: IoInput = req.body;
  const output = await authProcesses.platform(input);

  res.json(output.json);
});

/**
 * Destination for Twitter oAuth PKCE redirect
 */
app.post('/auth/pkce', async (req, res) => {
  const input: IoInput = req.body;
  const output = await authProcesses.pkce(input);

  res.json(output.json);
});

async function init() {
  /**
   * Create the test database with pre-intantiated data.
   */
  await serviceSetup(serverStore, memory);

  /**
   * Fetch roles from the database and populate the server store.
   * The auth API assigns grants based on roles in the server store; which should
   * be loaded in at startup.
   */
  serverStore.dispatch(coreActions.create(await dbmemory.read({
    role: {},
  }, { scope: { role: 'global' } })));

  /**
   * Start the service to serve the client files.
   */
  app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
  });
}

init();
