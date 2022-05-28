import { ApiPayload, ApiQueries } from '@amnis/core/api';
import { ApiRequestBodyDispatch, ApiRequestBodySelect } from './types';

export function apiQueriesGenerate(): ApiQueries {
  return {
    dispatch: (payload: ApiPayload<ApiRequestBodyDispatch>) => ({
      url: 'dispatch',
      method: 'post',
      body: payload.body,
    }),
    select: (payload: ApiPayload<ApiRequestBodySelect>) => ({
      url: 'select',
      method: 'post',
      body: payload.body,
    }),
  };
}

export default apiQueriesGenerate;
