// import type { EnhancedStore } from '@reduxjs/toolkit';
import { ApiHandlers } from '@amnis/core/api';
import { entityQuerySelect } from '@amnis/core/entity';
import { Store } from '@reduxjs/toolkit';
import type {
  StateApiRequestBodyDispatch,
  StateApiRequestBodySelect,
  StateApiResponseBodyDispatch,
  StateApiResponseBodySelect,
} from './stateApi.types';

export function stateApiHandlersGenerate(
  store: Store,
  dbs: ((s: Store) => void)[] = [],
): ApiHandlers {
  return {
    dispatch: (body: StateApiRequestBodyDispatch): StateApiResponseBodyDispatch => {
      /**
       * Dispatch action to the API store.
       */
      store.dispatch(body);
      const response: StateApiResponseBodyDispatch = {
        type: body.type,
        payload: body.payload,
      };

      /**
       * Push store data to the database.
       */
      dbs.forEach((db) => db(store));
      return response;
    },
    select: (body: StateApiRequestBodySelect): StateApiResponseBodySelect => {
      const { slice, query } = body;

      const result = entityQuerySelect(store.getState(), slice, query);

      return { result };
    },
  };
}

export default stateApiHandlersGenerate;
