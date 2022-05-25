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
        case entityActions.create.type: db.create(store); break;
        default:
      }

      return response;
    },
    select: (body: StateApiRequestBodySelect, store, db): StateApiResponseBodySelect => {
      const { slice, query } = body;

      const result = entityQuerySelect(store.getState(), slice, query);

      console.log(db.select(query));

      return { result };
    },
  };
}

export default stateApiHandlersGenerate;
