import { rtkqr } from '@amnis/core';
import { dynamicBaseQuery } from '../util/index.js';
import { apiCrudQueries } from './crud.queries.js';

export const apiCrud = rtkqr.createApi({
  reducerPath: 'apiCrud',
  baseQuery: dynamicBaseQuery('core'),
  endpoints: (builder) => apiCrudQueries(builder),
});

export default apiCrud;
