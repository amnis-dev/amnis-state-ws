import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Entity } from '@amnis/core/entity.types';
import type {
  ApiReadResponse,
  ApiReadRequest,
} from './api.types';

export const baseUrlDefault: string = process.env.AMNIS_STATE_API_URL || 'http://localhost:4000/api/';

/**
 * Generates query reducers and functionality.
 */
export function apiSlice<E extends Entity>(name: string, baseUrl = baseUrlDefault) {
  return createApi({
    reducerPath: `${name}Api`,
    baseQuery: fetchBaseQuery({ baseUrl }),
    endpoints: (builder) => ({
      read: builder.query<ApiReadResponse<E>, ApiReadRequest<E>>({
        query: (request) => ({
          url: `${name}/read`,
          method: 'post',
          body: request,
        }),
      }),
    }),
  });
}

export default { apiSlice };
