import { rest } from 'msw';
import { setupServer } from 'msw/node';
import type { Entity } from '@amnis/core/entity';
import { entityApiBaseUrl } from './entityApi.const';
import type {
  EntityApiHandlers,
  EntityApiReadRequest,
  EntityApiReadResponse,
} from './entityApi.types';

export const entityApiHandlers: EntityApiHandlers = {
  create: (body) => {
    const response = {};
    return response;
  },
  read: (body) => {
    const response = {};
    return response;
  },
};

export function entityApiMockHandlers(
  name: string,
  database: Record<string, Entity[]>,
  baseUrl = entityApiBaseUrl,
) {
  return [
    /**
     * Entity Create Handler.
     */
    rest.post<EntityApiReadRequest, never, EntityApiReadResponse>(
      `${baseUrl}create`,
      (req, res, ctx) => {
        const response = entityApiHandlers.read(req.body);

        return res(
          ctx.status(200),
          ctx.json(response),
        );
      },
    ),

    /**
     * Entity Read Handler.
     */
    rest.post<EntityApiReadRequest, never, EntityApiReadResponse>(
      `${baseUrl}read`,
      (req, res, ctx) => {
        const response = entityApiHandlers.read(req.body);

        return res(
          ctx.status(200),
          ctx.json(response),
        );
      },
    ),
  ];
}

export function entityApiMockServer(
  name: string,
  database: Record<string, Entity[]>,
  baseUrl = entityApiBaseUrl,
) {
  return setupServer(...entityApiMockHandlers(name, database, baseUrl));
}

export default entityApiMockServer;
