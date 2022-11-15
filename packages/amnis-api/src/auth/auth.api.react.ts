import { rtkqr } from '@amnis/core';
import { dynamicBaseQuery } from '../util/index.js';
import { apiAuthQueries } from './auth.queries.js';

export const apiAuth = rtkqr.createApi({
  reducerPath: 'apiAuth',
  baseQuery: dynamicBaseQuery(),
  endpoints: (builder) => apiAuthQueries(builder),
});

export default apiAuth;
