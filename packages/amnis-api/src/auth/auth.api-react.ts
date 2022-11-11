import { createApi } from '@amnis/core/rtkqr';
import { dynamicBaseQueryAuth } from '../util/index.js';
import { apiAuthQueries } from './auth.queries.js';

export const apiAuth = createApi({
  reducerPath: 'apiAuth',
  baseQuery: dynamicBaseQueryAuth,
  endpoints: (builder) => apiAuthQueries(builder),
});

export default apiAuth;
