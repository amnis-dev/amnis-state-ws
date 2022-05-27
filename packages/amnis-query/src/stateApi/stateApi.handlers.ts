// import type { EnhancedStore } from '@reduxjs/toolkit';
import { ApiHandlers } from '@amnis/core/api';
import { entityActions, entityQuerySelect } from '@amnis/core/entity';
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
      const response: StateApiResponseBodyDispatch = {
        type: body.type,
        payload: body.payload,
      };

      /**
       * Perform database actions.
       */
      switch (body.type) {
        case entityActions.create.type: db.create(store.getState()); break;
        default:
      }

      return response;
    },
    select: (body: StateApiRequestBodySelect, store, db): StateApiResponseBodySelect => {
      const { select } = body;

      const result = db.select(select);

      return { result };
    },
  };
}

export default stateApiHandlersGenerate;
