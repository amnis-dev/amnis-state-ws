import { rest } from 'msw';
import { setupServer } from 'msw/node';
import type { Entity } from '@amnis/core/entity.types';
import { baseUrlDefault } from './common';
import type { EntityApiReadRequest, EntityApiReadResponse } from './entityApi';

export function apiHandlers<E extends Entity>(
  name: string,
  database: Record<string, E[]>,
  baseUrl = baseUrlDefault,
) {
  const url = `${baseUrl}entity/read`;
  return [
    rest.post<EntityApiReadRequest<E>, never, EntityApiReadResponse<E>>(
      url,
      (req, res, ctx) => {
        const {
          nest, filter, start, limit,
        } = req.body;

        const result = {
          [name]: database[name],
        };

        return res(
          ctx.status(200),
          ctx.json(result),
        );
      },
    ),
  ];
}

export function mockServer<E extends Entity>(
  name: string,
  database: Record<string, E[]>,
  baseUrl = baseUrlDefault,
) {
  return setupServer(...apiHandlers<E>(name, database, baseUrl));
}

export default mockServer;
