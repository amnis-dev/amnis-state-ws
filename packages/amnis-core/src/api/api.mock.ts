import { Store } from '@reduxjs/toolkit';
import { rest, RestHandler } from 'msw';
import { setupServer } from 'msw/node';
import { Database } from '../db/db.types';
import type { ApiHandlers, ApiRequestBody, ApiResponseBody } from './api.types';

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
        const store = storeBuilder();
        const response = handlers[key](req.body, store, database);

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
