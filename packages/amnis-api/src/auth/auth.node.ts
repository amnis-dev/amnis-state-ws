import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query';
import fetch, { Headers, Request } from 'cross-fetch';
import { ResultCreate } from '@amnis/core/types';
import { apiAuthUrl } from '../const';
import {
  apiQueries,
} from './auth.queries';
import { ApiJSON } from '../types';
import { ApiAuthAuthorizeBody, ApiAuthLoginBody } from './auth.types';

global.Headers = Headers;
global.Request = Request;

const queries = apiQueries();

export const apiAuth = createApi({
  reducerPath: 'apiAuth',
  baseQuery: fetchBaseQuery({
    baseUrl: apiAuthUrl,
    fetchFn: fetch,
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

export default apiAuth;
