/* eslint-disable @typescript-eslint/no-explicit-any */
import fetch, { Headers, Request } from 'cross-fetch';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/dist/query/index.js';
import { rtkq } from '@amnis/core';
import { headersAuthorizationToken } from './util.headers.js';
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
    prepareHeaders: apiMeta?.bearerId ? headersAuthorizationToken(apiMeta.bearerId) : undefined,
  });
  return rawBaseQuery(args, store, extraOptions);
};

export default dynamicBaseQuery;
