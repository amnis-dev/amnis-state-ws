import { rest, RestHandler } from 'msw';
import { setupServer } from 'msw/node';
import type { ApiHandlers, ApiRequest, ApiResponse } from './types';
import { apiBaseUrl } from './const';

export function apiMockGenerateHandlers(
  handlers: ApiHandlers,
  baseUrl = apiBaseUrl,
) {
  const mockHandlers: RestHandler[] = Object.keys(handlers).map((key) => (
    rest.post<ApiRequest, never, ApiResponse>(
      `${baseUrl}${key}`,
      (req, res, ctx) => {
        const { body } = req;
        const response = handlers[key]({ body });

        const finalResponse = {
          errors: [],
          ...response,
        };

        return res(
          ctx.status(200),
          ctx.json(finalResponse),
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
