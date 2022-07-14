import express from 'express';
import cookieParser from 'cookie-parser';

import { mwInputOutput } from './middleware/mwInputOutput';

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

export const authRouter = router;

export default authRouter;
