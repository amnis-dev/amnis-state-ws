import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query';
import fetch, { Headers, Request } from 'cross-fetch';
import { ResultCreate } from '@amnis/core/state';
import { API_AUTH_URL } from '../const';
import {
  apiQueries,
} from './auth.queries';
import { ApiJSON } from '../types';
import {
  ApiAuthAuthorizeBody,
  ApiAuthLoginBody,
  ApiAuthPkceBody,
} from './auth.types';

global.Headers = Headers;
global.Request = Request;

const queries = apiQueries();

export const apiAuth = createApi({
  reducerPath: 'apiAuth',
  baseQuery: fetchBaseQuery({
    baseUrl: API_AUTH_URL,
    fetchFn: fetch,
  }),
  endpoints: (builder) => ({

    login: builder.query<
    ApiJSON<ResultCreate>,
    ApiAuthLoginBody
    >({
      query: queries.login,
    }),

    pkce: builder.query<
    ApiJSON<ResultCreate>,
    ApiAuthPkceBody
    >({
      query: queries.pkce,
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
