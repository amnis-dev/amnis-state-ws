import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ResultCreate, ResultUpdate } from '@amnis/core/state';
import { apiConfig } from '../config';
import {
  apiQueries,
} from './auth.queries';
import { ApiJSON } from '../types';
import {
  ApiAuthLoginBody,
  ApiAuthPkceBody,
  ApiAuthRenewBody,
  ApiAuthVerifyBody,
} from './auth.types';

const queries = apiQueries();

export const apiAuth = createApi({
  reducerPath: 'apiAuth',
  baseQuery: fetchBaseQuery({
    baseUrl: apiConfig.API_AUTH_URL,
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

    renew: builder.query<
    ApiJSON<ResultUpdate>,
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
