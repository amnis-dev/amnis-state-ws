/* eslint-disable @typescript-eslint/no-explicit-any */
import fetch, { Headers, Request } from 'cross-fetch';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/dist/query/index.js';
import { rtkq } from '@amnis/core';
import { headersAuthorizationToken } from './util.headers.js';

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
  bearerId,
) => async (args, store, extraOptions) => {
  const baseUrl = (store.getState() as any).api?.[reducerPath] as string || 'https://amnis.dev/api/auth';
  const rawBaseQuery = rtkq.fetchBaseQuery({
    baseUrl,
    fetchFn: fetch,
    prepareHeaders: bearerId ? headersAuthorizationToken(bearerId) : undefined,
  });
  return rawBaseQuery(args, store, extraOptions);
};

export default dynamicBaseQuery;
