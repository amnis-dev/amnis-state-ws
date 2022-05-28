import type { Action, Store } from '@reduxjs/toolkit';
import { rest, RestHandler } from 'msw';
import { setupServer } from 'msw/node';
import type { Database } from '@amnis/core/index';
import type { ApiHandlers, ApiRequestBody, ApiResponseBody } from './types';

export function apiMockGenerateHandlers(
  baseUrl: string,
  storeBuilder: () => Store,
  handlers: ApiHandlers,
  database: Database,
) {
  const mockHandlers: RestHandler[] = Object.keys(handlers).map((key) => (
    rest.post<ApiRequestBody, never, ApiResponseBody>(
      `${baseUrl}${key}`,
      (req, res, ctx) => {
        const body = req.body as Action;
        const store = storeBuilder();
        const response = handlers[key]({ body, store, database });

        return res(
          ctx.status(200),
          ctx.json(response),
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
