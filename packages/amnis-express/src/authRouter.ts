import express, { Router } from 'express';
import cookieParser from 'cookie-parser';

import { apiAuthProcesses } from '@amnis/state/env.node';
import type { ApiContext } from '@amnis/state/index';

import { mwInputOutput } from './middleware/mwInputOutput';

export const authRouter = (context: ApiContext): Router => {
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
  Object.keys(apiAuthProcesses).forEach((key) => {
    router.post(`/${key}`, async (req, res) => {
      const output = await apiAuthProcesses[key](context)(req.input);
      res.output(output);
      res.end();
    });
  });

  return router;
};

export default authRouter;
