// import type { EnhancedStore } from '@reduxjs/toolkit';
import { Result } from '@amnis/core/index';
import { coreActions } from '@amnis/core/actions';
import type {
  ApiHandlers,
  ApiResponseBodyDispatch,
  ApiResponseBodySelect,
} from './types';

export function apiHandlersGenerate(): ApiHandlers {
  return {
    dispatch: ({ body, store, database }): ApiResponseBodyDispatch => {
      /**
       * Dispatch action to the API store.
       */
      store.dispatch(body);

      let result: Result = {};

      /**
       * Perform database actions.
       */
      switch (body.type) {
        case coreActions.create.type: result = database.create(store.getState()); break;
        default:
      }

      return result;
    },
    select: ({ body, database }): ApiResponseBodySelect => {
      const { select } = body;

      const result = database.select(select);

      return result;
    },
  };
}

export default apiHandlersGenerate;
