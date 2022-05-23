import { rest, RestHandler } from 'msw';
import { setupServer } from 'msw/node';
import { ApiRequestBody, ApiResponseBody } from '@amnis/core/api';
import { entityApiBaseUrl } from './entityApi.const';
import { entityApiHandlersGenerate } from './entityApi.handlers';

export function entityApiMockHandlers(
  baseUrl = entityApiBaseUrl,
) {
  const handlers = entityApiHandlersGenerate();

  const mockHandlers: RestHandler[] = Object.keys(handlers).map((key) => (
    rest.post<ApiRequestBody, never, ApiResponseBody>(
      `${baseUrl}${key}`,
      (req, res, ctx) => {
        const response = handlers[key](req.body);

        return res(
          ctx.status(200),
          ctx.json(response),
        );
      },
    )
  ));

  return mockHandlers;
}

export function entityApiMockServer(
  baseUrl = entityApiBaseUrl,
) {
  return setupServer(...entityApiMockHandlers(baseUrl));
}
