// import type { EnhancedStore } from '@reduxjs/toolkit';
import { ApiHandlers } from '@amnis/core/api';
import { Selector, Store } from '@reduxjs/toolkit';
import type {
  StateApiRequestBodyDispatch,
  StateApiRequestBodySelect,
  StateApiResponseBodyDispatch,
  StateApiResponseBodySelect,
} from './stateApi.types';

export function stateApiHandlersGenerate(
  store: Store,
  selectors: Record<string, Record<string, Selector>>,
): ApiHandlers {
  return {
    dispatch: (body: StateApiRequestBodyDispatch): StateApiResponseBodyDispatch => {
      store.dispatch(body);
      const response: StateApiResponseBodyDispatch = {
        type: body.type,
        payload: body.payload,
      };
      return response;
    },
    select: (body: StateApiRequestBodySelect): StateApiResponseBodySelect => {
      let result = null;

      const slice = selectors[body.slice];
      if (slice) {
        const selector = slice[body.selector];
        if (selector) {
          result = selector(store.getState());
        }
      }

      const response: StateApiResponseBodySelect = {
        result: {
          [body.slice]: result,
        },
      };
      return response;
    },
  };
}

export default stateApiHandlersGenerate;
