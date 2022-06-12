/* eslint-disable @typescript-eslint/ban-ts-comment */
import { authTokenSecret } from '@amnis/auth/const';
import { jwtVerify } from '@amnis/auth/token';
import { JWTEncoded } from '@amnis/core/types';
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
      (req, res, ctx) => {
        const { body } = req;

        const input: ApiInput = { body };

        const authorization = req.headers.get('Authorization');

        if (authorization) {
          const [type, jwtEncoded] = authorization.split(' ');
          if (type === 'Bearer') {
            const jwt = jwtVerify(jwtEncoded as JWTEncoded, authTokenSecret);
            input.jwt = jwt;
          }
        }

        const output = processes[key](input);

        const ctxCookies = Object.keys(output.cookies).map(
          (cookieName) => ctx.cookie(cookieName, output.cookies[cookieName], {
            path: '/',
            sameSite: 'lax',
            httpOnly: true,
            secure: false, // Set to falst because this is a mock service.
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
