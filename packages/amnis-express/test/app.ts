import express from 'express';

import { validatorsSetup, ApiContext } from '@amnis/state/env.node';
import { storeSetup } from '@amnis/state/env.node/store';
import { memory } from '@amnis/state/env.node/db.memory';
import { authSchema } from '@amnis/state/env.node/schema.auth';

import { authRouter } from '../src/authRouter';

const app = express();

const store = storeSetup();
const validators = validatorsSetup([authSchema]);

export const appContext: ApiContext = {
  store,
  database: memory,
  validators,
};

const authApp = authRouter(appContext);

app.use('/auth', authApp);

export default app;
