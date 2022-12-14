/* eslint-disable @typescript-eslint/no-explicit-any */
import type { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions.js';
import {
  ApiAuthChallenge,
  ApiAuthLogin,
  ApiAuthLogout,
  ApiAuthPkce,
  ApiAuthRenew,
  ApiAuthVerify,
  Challenge,
  Entity,
  IoOutputJson,
  StateDeleter,
  StateEntities,
} from '@amnis/core';

export const apiAuthQueries = <T extends EndpointBuilder<any, any, any>>(builder: T) => ({

  challenge: builder.mutation<
  IoOutputJson<Entity<Challenge>>,
  ApiAuthChallenge
  >({
    query: (payload) => ({
      url: 'challenge',
      method: 'post',
      body: payload,
    }),
  }),

  login: builder.mutation<
  IoOutputJson<StateEntities>,
  ApiAuthLogin
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
  ApiAuthLogout
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
  ApiAuthPkce
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
  ApiAuthRenew
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
  ApiAuthVerify
  >({
    query: (payload) => ({
      url: 'verify',
      method: 'post',
      body: payload,
    }),
  }),

});

export default apiAuthQueries;
