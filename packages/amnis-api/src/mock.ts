/* eslint-disable @typescript-eslint/ban-ts-comment */
import { authHeader } from '@amnis/auth/header';
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

        /**
         * Setup the process input.
         */
        const input: ApiInput = { body };

        /**
         * Capture the authorization token if sent with the request.
         */
        const authorization = req.headers.get('Authorization');
        input.jwt = authHeader.authorizationParse(authorization);

        /**
         * Call the api process.
         */
        const output = await processes[key](input);

        /**
         * Set the response cookies based on the output cookies array.
         */
        const ctxCookies = Object.keys(output.cookies).map(
          (cookieName) => ctx.cookie(cookieName, output.cookies[cookieName], {
            path: '/',
            sameSite: 'lax',
            httpOnly: true,
            /**
             * Secure is false since this is a mock service.
             * Ensure this is true for a production service.
             */
            secure: false,
          }),
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
