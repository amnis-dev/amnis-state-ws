import fetch, { Headers, Request } from 'cross-fetch';
import { createApi, fetchBaseQuery } from '@amnis/core/rtkq.js';
import { apiConfig } from '../config.js';
import type { ApiBaseQueryFn } from '../types.js';
import { headersAuthorizationToken } from '../util/util.headers.js';
import { apiCrudQueries } from './crud.queries.js';

global.Headers = Headers;
global.Request = Request;

export const apiCrud = createApi({
  reducerPath: 'apiCrud',
  baseQuery: fetchBaseQuery({
    baseUrl: apiConfig.API_CRUD_URL,
    fetchFn: fetch,
    prepareHeaders: headersAuthorizationToken,
  }) as ApiBaseQueryFn,
  endpoints: (builder) => apiCrudQueries(builder),
});

export default apiCrud;
