import { rtkq } from '@amnis/core';
import { dynamicBaseQueryAuth } from '../util/index.js';
import { apiAuthQueries } from './auth.queries.js';

export const apiAuth = rtkq.createApi({
  reducerPath: 'apiAuth',
  baseQuery: dynamicBaseQueryAuth,
  endpoints: (builder) => apiAuthQueries(builder),
});

export default apiAuth;
