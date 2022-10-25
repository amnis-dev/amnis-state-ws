/* eslint-disable @typescript-eslint/no-explicit-any */
import type { EndpointBuilder } from '@reduxjs/toolkit/query/endpointDefinitions.js';
import {
  AuthLogin,
  AuthLogout,
  AuthPkce,
  AuthRenew,
  AuthVerify,
  IoOutputJson,
  StateCreate,
  StateDelete,
  StateUpdate,
} from '@amnis/core';

export const apiAuthQueries = <T extends EndpointBuilder<any, any, any>>(builder: T) => ({

  login: builder.query<
  IoOutputJson<StateCreate>,
  AuthLogin
  >({
    query: (payload) => ({
      url: 'login',
      method: 'post',
      credentials: 'include',
      body: payload,
    }),
  }),

  logout: builder.query<
  IoOutputJson<StateDelete>,
  AuthLogout
  >({
    query: (payload) => ({
      url: 'logout',
      method: 'post',
      credentials: 'include',
      body: payload,
    }),
  }),

  pkce: builder.query<
  IoOutputJson<StateCreate>,
  AuthPkce
  >({
    query: (payload) => ({
      url: 'pkce',
      method: 'post',
      credentials: 'include',
      body: payload,
    }),
  }),

  renew: builder.query<
  IoOutputJson<StateUpdate>,
  AuthRenew
  >({
    query: (payload) => ({
      url: 'renew',
      method: 'post',
      credentials: 'include',
      body: payload,
    }),
  }),

  verify: builder.query<
  IoOutputJson<boolean>,
  AuthVerify
  >({
    query: (payload) => ({
      url: 'verify',
      method: 'post',
      body: payload,
    }),
  }),

});

export default apiAuthQueries;
