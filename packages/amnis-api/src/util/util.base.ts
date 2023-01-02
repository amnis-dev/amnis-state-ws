/* eslint-disable @typescript-eslint/no-explicit-any */
import fetch, { Headers, Request } from 'cross-fetch';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/dist/query/index.js';
import { rtkq, State } from '@amnis/core';
import { headersAuthorizationToken, headersChallenge, headersSignature } from './util.headers.js';
import { apiSelectors } from '../api/api.js';

global.Headers = Headers;
global.Request = Request;

type DynamicBaseQuery = BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>;
type DynamicBaseQuerySetup = (reducerPath: string, bearerId?: string) => DynamicBaseQuery;

/**
 * Gets the baseURL based on configuration.
 *
 * store is the complete redux store.
 */
export const dynamicBaseQuery: DynamicBaseQuerySetup = (
  reducerPath,
) => async (args, store, extraOptions) => {
  const apiMeta = apiSelectors.selectById((store.getState() as any), reducerPath);
  const rawBaseQuery = rtkq.fetchBaseQuery({
    baseUrl: apiMeta ? apiMeta.baseUrl : '',
    fetchFn: fetch,
    prepareHeaders: async (headers, api) => {
      const state = api.getState() as State;

      /**
       * Apply a bearer if needed.
       */
      if (apiMeta?.bearerId) {
        headersAuthorizationToken(headers, state, apiMeta.bearerId);
      }

      /**
       * Provide a signature headers on the required requests
       */
      if (
        apiMeta?.sign
        && (apiMeta.sign === true || apiMeta.sign.includes(api.endpoint))
      ) {
        if (typeof args === 'string') {
          await headersSignature(headers, args);
        } else {
          await headersSignature(headers, args.body);
        }
      }

      /**
       * Provide challenge headers on the required requests
       */
      if (
        apiMeta?.challenge
        && (apiMeta.challenge === true || apiMeta.challenge.includes(api.endpoint))
      ) {
        await headersChallenge(headers, state, `${reducerPath}/${api.endpoint}`);
      }

      headers.forEach((value, key) => console.log(`HEADER ... ${key}: ${value}`));

      return headers;
    },
  });
  return rawBaseQuery(args, store, extraOptions);
};

export default dynamicBaseQuery;
