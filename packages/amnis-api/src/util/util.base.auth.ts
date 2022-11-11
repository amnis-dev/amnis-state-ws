/* eslint-disable @typescript-eslint/no-explicit-any */
import fetch, { Headers, Request } from 'cross-fetch';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/dist/query/index.js';
import { rtkq } from '@amnis/core';
import { apiConfig } from '../config.js';

global.Headers = Headers;
global.Request = Request;

type DynamicBaseQuery = BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>;

/**
 * Gets the baseURL based on configuration.
 *
 * store is the complete redux store.
 */
export const dynamicBaseQueryAuth: DynamicBaseQuery = async (args, store, extraOptions) => {
  const baseUrl = apiConfig.API_AUTH_URL;
  const rawBaseQuery = rtkq.fetchBaseQuery({
    baseUrl,
    fetchFn: fetch,
  });
  return rawBaseQuery(args, store, extraOptions);
};

export default dynamicBaseQueryAuth;
