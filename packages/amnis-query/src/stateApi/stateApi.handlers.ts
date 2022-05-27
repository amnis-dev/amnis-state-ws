// import type { EnhancedStore } from '@reduxjs/toolkit';
import { ApiHandlers } from '@amnis/core/api';
import { Result } from '@amnis/core/index';
import { entityActions } from '@amnis/core/entity';
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
        case entityActions.create.type: result = db.create(store.getState()); break;
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
