/* eslint-disable @typescript-eslint/ban-ts-comment */
import { authHeader } from '@amnis/auth/header';
import type { JWTEncoded } from '@amnis/core/token';
import { rest, RestHandler } from 'msw';
import { setupServer } from 'msw/node';
import type { ApiProcesses, ApiInput, ApiOutput } from './types';

export function apiMockGenerateHandlers(
  processes: ApiProcesses,
  baseUrl: string,
) {
  const mockHandlers: RestHandler[] = Object.keys(processes).map((key) => (
    rest.post<ApiInput['body'], never, ApiOutput['json']>(
      `${baseUrl}${key}`,
      async (req, res, ctx) => {
        const { body } = req;
        const { authSession } = req.cookies;

        /**
         * Setup the process input.
         */
        const input: ApiInput = { body };

        /**
         * Set the encoded session cookie on the input.
         */
        input.sessionEncoded = authSession as JWTEncoded;

        /**
         * Capture the authorization token if sent with the request.
         */
        const authorization = req.headers.get('Authorization');
        input.jwtEncoded = authHeader.authorizationParse(authorization);

        /**
         * Call the api process.
         */
        const output = await processes[key](input);

        /**
         * Set the response cookies based on the output cookies array.
         */
        const ctxCookies = Object.keys(output.cookies).map(
          (cookieName) => {
            const cookieValue = output.cookies[cookieName];
            if (cookieValue !== undefined) {
              return ctx.cookie(cookieName, cookieValue, {
                path: '/',
                sameSite: 'lax',
                httpOnly: true,
                /**
               * Secure is false since this is a mock service.
               * Ensure this is true for a production service.
               */
                secure: false,
              });
            }
            return ctx.cookie(cookieName, '', { expires: new Date() });
          },
        );

        return res(
          ctx.status(output.status),
          ctx.json(output.json),
          ...ctxCookies,
        );
      },
    )
  ));

  return mockHandlers;
}

export function apiMockServer(
  mockHandlers: RestHandler[],
) {
  return setupServer(...mockHandlers);
}
