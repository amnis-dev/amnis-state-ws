import { authHeader } from '@amnis/state/env.node';
import type { ApiInput } from '@amnis/state/index';
import type { RequestHandler } from 'express';

/**
 * Parses and prepares Amnis Input and responses from Amnis Output objects.
 * Expects body to be parsed as JSON (`express.json()` middleware).
 * Expects cookies to be parsed (`cookieParser()` middleware).
 */
export const mwInputOutput = (): RequestHandler => (
  (req, res, next) => {
    /**
     * Extract body and authSession data.
     */
    const { body } = req;
    const { authSession } = req.cookies;

    /**
     * Create and setup the input object for Amnis processes.
     */
    const input: ApiInput = {
      body,
      sessionEncoded: authSession,
    };

    /**
     * Extract authorization header.
     */
    const authorization = req.header('Authorization');
    input.jwtEncoded = authHeader.authorizationParse(authorization);

    /**
     * Set the input on the request.
     */
    req.input = input;

    /**
     * Prepare the response output with defaults.
     */
    res.output = (output) => {
      /**
       * Prepare any cookies set on the output.
       */
      Object.keys(output.cookies).forEach(
        (cookieName) => {
          if (output.cookies[cookieName] !== undefined) {
            res.cookie(cookieName, output.cookies[cookieName], {
              path: '/',
              sameSite: process.env.NODE_ENV !== 'development' ? 'none' : 'lax',
              httpOnly: true,
              secure: process.env.NODE_ENV !== 'development',
            });
          } else {
            res.clearCookie(cookieName);
          }
        },
      );

      /**
       * Set the response status and contents on the response.
       */
      res.status(output.status).json(output.json);
    };

    /**
     * Process next method(s).
     */
    next();
  }
);

export default { mwInputOutput };
