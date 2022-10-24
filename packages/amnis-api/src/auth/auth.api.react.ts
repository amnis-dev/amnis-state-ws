import fetch, { Headers, Request } from 'cross-fetch';
import { createApiReact, fetchBaseQueryReact } from '@amnis/core/rtkqr.js';
import { apiConfig } from '../config.js';
import { apiAuthQueries } from './auth.queries.js';

global.Headers = Headers;
global.Request = Request;

export const apiAuth = createApiReact({
  reducerPath: 'apiAuth',
  baseQuery: fetchBaseQueryReact({
    baseUrl: apiConfig.API_AUTH_URL,
    fetchFn: fetch,
  }),
  endpoints: (builder) => apiAuthQueries(builder),
});

export default apiAuth;
