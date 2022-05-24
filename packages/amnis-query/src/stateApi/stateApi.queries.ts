import { ApiPayload, ApiQueries } from '@amnis/core/api';
import { StateApiRequestBodyDispatch, StateApiRequestBodySelect } from './stateApi.types';

export function stateApiQueriesGenerate(): ApiQueries {
  return {
    dispatch: (payload: ApiPayload<StateApiRequestBodyDispatch>) => ({
      url: 'dispatch',
      method: 'post',
      body: payload.body,
    }),
    select: (payload: ApiPayload<StateApiRequestBodySelect>) => ({
      url: 'select',
      method: 'post',
      body: payload.body,
    }),
  };
}

export default stateApiQueriesGenerate;
