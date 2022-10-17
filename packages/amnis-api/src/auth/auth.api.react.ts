import { createApi, fetchBaseQuery } from '@amnis/core/rtkqr.js';
import { StateCreate, StateDelete, StateUpdate } from '@amnis/core/state/index.js';
import { apiConfig } from '../config.js';
import {
  apiQueries,
} from './auth.queries.js';
import { ApiJSON } from '../types.js';
import {
  ApiAuthBodyLogin,
  ApiAuthBodyLogout,
  ApiAuthBodyPkce,
  ApiAuthBodyRenew,
  ApiAuthBodyVerify,
} from './auth.types.js';

const queries = apiQueries();

export const apiAuth = createApi({
  reducerPath: 'apiAuth',
  baseQuery: fetchBaseQuery({
    baseUrl: apiConfig.API_AUTH_URL,
  }),
  endpoints: (builder) => ({

    login: builder.query<
    ApiJSON<StateCreate>,
    ApiAuthBodyLogin
    >({
      query: queries.login,
    }),

    logout: builder.query<
    ApiJSON<StateDelete>,
    ApiAuthBodyLogout
    >({
      query: queries.logout,
    }),

    pkce: builder.query<
    ApiJSON<StateCreate>,
    ApiAuthBodyPkce
    >({
      query: queries.pkce,
    }),

    renew: builder.query<
    ApiJSON<StateUpdate>,
    ApiAuthBodyRenew
    >({
      query: queries.renew,
    }),

    verify: builder.query<
    ApiJSON<boolean>,
    ApiAuthBodyVerify
    >({
      query: queries.verify,
    }),

  }),
});

export default apiAuth;
