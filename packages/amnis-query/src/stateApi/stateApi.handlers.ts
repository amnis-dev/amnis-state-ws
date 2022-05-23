// import type { EnhancedStore } from '@reduxjs/toolkit';
import { ApiHandlers } from '@amnis/core/api';
import type {
  StateApiRequestBodyDispatch,
  StateApiResponseBodyDispatch,
} from './stateApi.types';

export function stateApiHandlersGenerate(/** store: EnhancedStore */): ApiHandlers {
  return {
    dispatch: (body: StateApiRequestBodyDispatch): StateApiResponseBodyDispatch => {
      const response: StateApiResponseBodyDispatch = {
        type: body.type,
        payload: body.payload,
      };
      return response;
    },
  };
}

export default stateApiHandlersGenerate;
