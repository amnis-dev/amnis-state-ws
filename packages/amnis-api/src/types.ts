import type { IoOutputJson } from '@amnis/core';
import type { BaseQueryFn, FetchArgs } from '@reduxjs/toolkit/dist/query';
import type { BaseQueryApi } from '@reduxjs/toolkit/dist/query/baseQueryTypes.js';
import type { MaybePromise } from '@reduxjs/toolkit/dist/query/tsHelpers.js';

/**
 * RTK type.
 */
export type ApiBaseQueryFn = BaseQueryFn<
string | FetchArgs,
unknown,
{ data: IoOutputJson, status: number }
>;

/**
 * RTK prepareHeaders function
 */
export type ApiPrepareHeaders = (
  headers: Headers,
  api: Pick<BaseQueryApi, 'type' | 'getState' | 'extra' | 'endpoint' | 'forced'>
) => MaybePromise<Headers>;
