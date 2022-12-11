/* eslint-disable @typescript-eslint/no-explicit-any */
import type { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions.js';
import {
  AuthChallenge,
  AuthLogin,
  AuthLogout,
  AuthPkce,
  AuthRenew,
  AuthVerify,
  IoOutputJson,
  StateDeleter,
  StateEntities,
} from '@amnis/core';

export const apiAuthQueries = <T extends EndpointBuilder<any, any, any>>(builder: T) => ({

  challenge: builder.mutation<
  IoOutputJson<StateEntities>,
  AuthChallenge
  >({
    query: (payload) => ({
      url: 'challenge',
      method: 'post',
      body: payload,
    }),
  }),

  login: builder.mutation<
  IoOutputJson<StateEntities>,
  AuthLogin
  >({
    query: (payload) => ({
      url: 'login',
      method: 'post',
      credentials: 'include',
      body: payload,
    }),
  }),

  logout: builder.mutation<
  IoOutputJson<StateDeleter>,
  AuthLogout
  >({
    query: (payload) => ({
      url: 'logout',
      method: 'post',
      credentials: 'include',
      body: payload,
    }),
  }),

  pkce: builder.mutation<
  IoOutputJson<StateEntities>,
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
  IoOutputJson<StateEntities>,
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
