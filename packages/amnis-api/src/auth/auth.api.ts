import { rtkq } from '@amnis/core';
import { dynamicBaseQuery } from '../util/index.js';
import { apiAuthQueries } from './auth.queries.js';

const reducerPath = 'apiAuth';

export const apiAuth = rtkq.createApi({
  reducerPath,
  baseQuery: dynamicBaseQuery(),
  endpoints: (builder) => apiAuthQueries(builder),
});

export default apiAuth;
