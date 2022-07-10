import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query';
import fetch, { Headers, Request } from 'cross-fetch';
import { StateCreate, StateDelete, StateUpdate } from '@amnis/core/state';
import { apiConfig } from '../config';
import {
  apiQueries,
} from './auth.queries';
import { ApiJSON } from '../types';
import {
  ApiAuthLoginBody,
  ApiAuthLogoutBody,
  ApiAuthPkceBody,
  ApiAuthRenewBody,
  ApiAuthVerifyBody,
} from './auth.types';

global.Headers = Headers;
global.Request = Request;

const queries = apiQueries();

export const apiAuth = createApi({
  reducerPath: 'apiAuth',
  baseQuery: fetchBaseQuery({
    baseUrl: apiConfig.API_AUTH_URL,
    fetchFn: fetch,
  }),
  endpoints: (builder) => ({

    login: builder.query<
    ApiJSON<StateCreate>,
    ApiAuthLoginBody
    >({
      query: queries.login,
    }),

    logout: builder.query<
    ApiJSON<StateDelete>,
    ApiAuthLogoutBody
    >({
      query: queries.logout,
    }),

    pkce: builder.query<
    ApiJSON<StateCreate>,
    ApiAuthPkceBody
    >({
      query: queries.pkce,
    }),

    renew: builder.query<
    ApiJSON<StateUpdate>,
    ApiAuthRenewBody
    >({
      query: queries.renew,
    }),

    verify: builder.query<
    ApiJSON<boolean>,
    ApiAuthVerifyBody
    >({
      query: queries.verify,
    }),

  }),
});

export default apiAuth;
