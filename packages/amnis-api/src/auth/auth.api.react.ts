import { createApi, fetchBaseQuery } from '@amnis/core/rtkqr.js';
import {
  StateCreate,
  StateDelete,
  StateUpdate,
  IoOutputJson,
  AuthLogin,
  AuthLogout,
  AuthPkce,
  AuthRenew,
  AuthVerify,
} from '@amnis/core/index.js';
import { apiConfig } from '../config.js';
import {
  apiQueries,
} from './auth.queries.js';

const queries = apiQueries();

export const apiAuth = createApi({
  reducerPath: 'apiAuth',
  baseQuery: fetchBaseQuery({
    baseUrl: apiConfig.API_AUTH_URL,
  }),
  endpoints: (builder) => ({

    login: builder.query<
    IoOutputJson<StateCreate>,
    AuthLogin
    >({
      query: queries.login,
    }),

    logout: builder.query<
    IoOutputJson<StateDelete>,
    AuthLogout
    >({
      query: queries.logout,
    }),

    pkce: builder.query<
    IoOutputJson<StateCreate>,
    AuthPkce
    >({
      query: queries.pkce,
    }),

    renew: builder.query<
    IoOutputJson<StateUpdate>,
    AuthRenew
    >({
      query: queries.renew,
    }),

    verify: builder.query<
    IoOutputJson<boolean>,
    AuthVerify
    >({
      query: queries.verify,
    }),

  }),
});

export default apiAuth;
