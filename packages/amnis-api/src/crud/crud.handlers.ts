// import type { EnhancedStore } from '@reduxjs/toolkit';
import { Result } from '@amnis/core/index';
import { coreActions } from '@amnis/core/actions';
import type {
  ApiCrudHandlers,
  ApiCrudResponseCreate,
} from './crud.types';

export function apiCrudHandlersGenerate(): ApiCrudHandlers {
  return {
    create: ({ body, store, database }): ApiCrudResponseCreate => {
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
    read: ({ body, database }) => {
      const { select } = body;

      const result = database.select(select);

      return result;
    },
    update: ({ body, store, database }) => {
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
    delete: ({ body, store, database }) => {
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

  };
}

export default apiCrudHandlersGenerate;
