// import type { EnhancedStore } from '@reduxjs/toolkit';
import { ApiHandlers } from '@amnis/core/api';
import { Result } from '@amnis/core/index';
import { coreActions } from '@amnis/core/actions';
import type {
  StateApiRequestBodyDispatch,
  StateApiRequestBodySelect,
  StateApiResponseBodyDispatch,
  StateApiResponseBodySelect,
} from './stateApi.types';

export function stateApiHandlersGenerate(): ApiHandlers {
  return {
    dispatch: (body: StateApiRequestBodyDispatch, store, db): StateApiResponseBodyDispatch => {
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
    select: (body: StateApiRequestBodySelect, store, db): StateApiResponseBodySelect => {
      const { select } = body;

      const result = db.select(select);

      return result;
    },
  };
}

export default stateApiHandlersGenerate;
