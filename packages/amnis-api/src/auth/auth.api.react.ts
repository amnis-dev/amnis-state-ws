import { createApiReact, fetchBaseQueryReact } from '@amnis/core/rtkqr.js';
import { apiConfig } from '../config.js';
import { apiAuthQueries } from './auth.queries.js';

export const apiAuth = createApiReact({
  reducerPath: 'apiAuth',
  baseQuery: fetchBaseQueryReact({
    baseUrl: apiConfig.API_AUTH_URL,
  }),
  endpoints: (builder) => apiAuthQueries(builder),
});

export default apiAuth;
