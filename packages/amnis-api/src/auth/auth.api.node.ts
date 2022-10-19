import fetch, { Headers, Request } from 'cross-fetch';
import { createApi, fetchBaseQuery } from '@amnis/core/rtkq.js';
import { apiConfig } from '../config.js';
import { apiAuthQueries } from './auth.queries.js';

global.Headers = Headers;
global.Request = Request;

export const apiAuth = createApi({
  reducerPath: 'apiAuth',
  baseQuery: fetchBaseQuery({
    baseUrl: apiConfig.API_AUTH_URL,
    fetchFn: fetch,
  }),
  endpoints: (builder) => apiAuthQueries(builder),
});

export default apiAuth;
