/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  IoInput, ioOutput, IoOutput, IoProcesses,
} from '@amnis/core';
import { rest, RequestHandler } from 'msw';
import { setupServer } from 'msw/node';

export function apiMockGenerateHandlers(
  apiIOs: IoProcesses,
  baseUrl: string,
) {
  const mockHandlers: RequestHandler[] = Object.keys(apiIOs).map((key) => (
    rest.post<IoInput['body'], never, IoOutput['json']>(
      `${baseUrl}${key}`,
      async (req, res, ctx) => {
        const { body } = req;
        const { authSession } = req.cookies;

        /**
         * Setup the process input.
         */
        const input: IoInput = { body };

        /**
         * Set the encoded session cookie on the input.
         */
        input.sessionEncryption = authSession;

        /**
         * Capture the authorization bearer if sent with the request.
         */
        const authorization = req.headers.get('Authorization');
        input.accessEncoded = authorization?.split(' ')[1];

        /**
         * Call the api process.
         */
        const output = ioOutput();

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
  mockHandlers: RequestHandler[],
) {
  /** @ts-ignore */
  return setupServer(...mockHandlers);
}
