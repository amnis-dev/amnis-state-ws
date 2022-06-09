import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ResultCreate } from '@amnis/core/types';
import { apiAuthUrl } from '../const';
import {
  apiQueries,
} from './auth.queries';
import { ApiJSON } from '../types';
import { ApiAuthAuthorizeBody, ApiAuthLoginBody } from './auth.types';

const queries = apiQueries();

export const apiCrud = createApi({
  reducerPath: 'apiAuth',
  baseQuery: fetchBaseQuery({
    baseUrl: apiAuthUrl,
  }),
  endpoints: (builder) => ({
    login: builder.query<
    ApiJSON<ResultCreate>,
    ApiAuthLoginBody
    >({
      query: queries.login,
    }),
    authorize: builder.query<
    ApiJSON<ResultCreate>,
    ApiAuthAuthorizeBody
    >({
      query: queries.authorize,
    }),
  }),
});

export default apiCrud;
