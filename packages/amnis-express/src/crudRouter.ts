import express, { Router } from 'express';
import cookieParser from 'cookie-parser';

import { apiCrudProcesses } from '@amnis/state/env.node';
import type { ApiContext } from '@amnis/state/index';

import { mwInputOutput } from './middleware/mwInputOutput';

export const crudRouter = (context: ApiContext): Router => {
  /**
   * Initialize modulated router.
   */
  const router = express.Router();

  /**
   * Required middleware.
   */
  router.use(express.json());
  router.use(cookieParser());

  /**
   * Amnis middleware.
   */
  router.use(mwInputOutput());

  /**
   * Build the routes.
   */
  Object.keys(apiCrudProcesses).forEach((key) => {
    router.post(`/${key}`, async (req, res) => {
      const output = await apiCrudProcesses[key](context)(req.input);
      res.output(output);
    });
  });

  return router;
};

export default crudRouter;
