// import type { EnhancedStore } from '@reduxjs/toolkit';
import { coreActions } from '@amnis/core/actions';
import {
  ResultCreate, ResultRead, ResultUpdate, ResultDelete,
} from '@amnis/core/types';
import type {
  ApiCrudHandlers,
} from './crud.types';

export function apiCrudHandlersGenerate(): ApiCrudHandlers {
  return {
    /**
     * API handler for creating new data in storage.
     */
    create: ({ body, store, database }): ResultCreate => {
      /**
       * Dispatch action to the API store.
       */
      store.dispatch(coreActions.create(body));

      const result = database.create(store.getState());

      return result;
    },

    /**
     * API handler for reading data from storage.
     */
    read: ({ body, database }): ResultRead => {
      const result = database.read(body);

      return result;
    },

    /**
     * API handler for updating data in storage.
     */
    update: ({ body, store, database }): ResultUpdate => {
      /**
       * Dispatch action to the API store.
       */
      store.dispatch(coreActions.update(body));

      const result = database.update(store.getState());

      return result;
    },

    /**
     * API handler for deleting data in storage. (Actually: only marks data as deleted)
     */
    delete: ({ body, database }): ResultDelete => {
      const result = database.delete(body);

      return result;
    },

  };
}

export default apiCrudHandlersGenerate;
