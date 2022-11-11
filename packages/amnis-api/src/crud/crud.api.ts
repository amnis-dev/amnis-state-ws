import { rtkq } from '@amnis/core';
import { dynamicBaseQueryCrud } from '../util/index.js';
import { apiCrudQueries } from './crud.queries.js';

export const apiCrud = rtkq.createApi({
  reducerPath: 'apiCrud',
  baseQuery: dynamicBaseQueryCrud,
  endpoints: (builder) => apiCrudQueries(builder),
});

export default apiCrud;
