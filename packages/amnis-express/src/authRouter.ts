import express, { Router } from 'express';
import cookieParser from 'cookie-parser';

import { mwInputOutput } from './middleware/mwInputOutput';

export const authRouter = (): Router => {
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

  return router;
};

export default authRouter;
