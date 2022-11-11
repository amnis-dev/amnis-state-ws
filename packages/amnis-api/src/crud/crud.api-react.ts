import { createApi } from '@amnis/core/rtkqr';
import { dynamicBaseQueryCrud } from '../util/index.js';
import { apiCrudQueries } from './crud.queries.js';

export const apiCrud = createApi({
  reducerPath: 'apiCrud',
  baseQuery: dynamicBaseQueryCrud,
  endpoints: (builder) => apiCrudQueries(builder),
});

export default apiCrud;
