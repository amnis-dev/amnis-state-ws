// import type { EnhancedStore } from '@reduxjs/toolkit';
import { ApiHandlers } from '@amnis/core/api';
import { Result } from '@amnis/core/index';
import { coreActions } from '@amnis/core/actions';
import type {
  ApiRequestBodyDispatch,
  ApiRequestBodySelect,
  ApiResponseBodyDispatch,
  ApiResponseBodySelect,
} from './types';

export function apiHandlersGenerate(): ApiHandlers {
  return {
    dispatch: (body: ApiRequestBodyDispatch, store, db): ApiResponseBodyDispatch => {
      /**
       * Dispatch action to the API store.
       */
      store.dispatch(body);

      let result: Result = {};

      /**
       * Perform database actions.
       */
      switch (body.type) {
        case coreActions.create.type: result = db.create(store.getState()); break;
        default:
      }

      return result;
    },
    select: (body: ApiRequestBodySelect, store, db): ApiResponseBodySelect => {
      const { select } = body;

      const result = db.select(select);

      return result;
    },
  };
}

export default apiHandlersGenerate;
