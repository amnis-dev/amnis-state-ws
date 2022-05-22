import { rest, RestHandler } from 'msw';
import { setupServer } from 'msw/node';
import type { EntityAmbiguous } from '@amnis/core/entity';
import { ApiRequestBody, ApiResponseBody } from '@amnis/core/api';
import { entityApiBaseUrl } from './entityApi.const';
import { entityApiGenerateHandlers } from './entityApi.handlers';

export function entityApiMockHandlers(
  name: string,
  database: Record<string, EntityAmbiguous[]>,
  baseUrl = entityApiBaseUrl,
) {
  const handlers = entityApiGenerateHandlers();

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
  name: string,
  database: Record<string, EntityAmbiguous[]>,
  baseUrl = entityApiBaseUrl,
) {
  return setupServer(...entityApiMockHandlers(name, database, baseUrl));
}
