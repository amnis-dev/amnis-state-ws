import { createApi, fetchBaseQuery } from '@amnis/core/rtkq.js';
import { apiConfig } from '../config.js';
import { apiAuthQueries } from './auth.queries.js';

export const apiAuth = createApi({
  reducerPath: 'apiAuth',
  baseQuery: fetchBaseQuery({
    baseUrl: apiConfig.API_AUTH_URL,
  }),
  endpoints: (builder) => apiAuthQueries(builder),
});

export default apiAuth;
