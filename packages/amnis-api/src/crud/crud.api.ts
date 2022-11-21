import { rtkq } from '@amnis/core';
import { dynamicBaseQuery } from '../util/index.js';
import { apiCrudQueries } from './crud.queries.js';

const reducerPath = 'apiCrud';

export const apiCrud = rtkq.createApi({
  reducerPath,
  baseQuery: dynamicBaseQuery('core'),
  endpoints: (builder) => apiCrudQueries(builder),
});

export default apiCrud;
