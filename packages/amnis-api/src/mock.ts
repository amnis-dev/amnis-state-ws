/* eslint-disable @typescript-eslint/ban-ts-comment */
import { rest, RestHandler } from 'msw';
import { setupServer } from 'msw/node';
import { Store } from '@reduxjs/toolkit';
import type { ApiProcesses, ApiInput, ApiOutput } from './types';

export function apiMockGenerateHandlers(
  store: Store,
  processes: ApiProcesses,
  baseUrl: string,
) {
  const mockHandlers: RestHandler[] = Object.keys(processes).map((key) => (
    rest.post<ApiInput['body'], never, ApiOutput['json']>(
      `${baseUrl}${key}`,
      (req, res, ctx) => {
        const { body } = req;

        const input: ApiInput = {
          store,
          body,
        };
        /** @ts-ignore */
        const output = processes[key](input, res);

        const ctxCookies = Object.keys(output.cookies).map(
          (cookieName) => ctx.cookie(cookieName, output.cookies[cookieName]),
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
