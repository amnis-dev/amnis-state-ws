import type { IoOutputJson } from '@amnis/core';
import type { BaseQueryFn, FetchArgs } from '@reduxjs/toolkit/dist/query';
import type { BaseQueryApi } from '@reduxjs/toolkit/query';
import type { MaybePromise } from '@reduxjs/toolkit/dist/query/tsHelpers';

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
