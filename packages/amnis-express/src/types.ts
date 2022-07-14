import type {
  Express,
  Request,
  Response,
  NextFunction,
} from 'express';

/**
 * An express Middleware function.
 */
export type ExpressMiddleware = (req: Request, res: Response, next: NextFunction) => void;
