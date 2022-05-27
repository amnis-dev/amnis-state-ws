import type { Entity, Database } from '@amnis/core/index';
import {
  EntityState,
} from '@reduxjs/toolkit';

/**
 * Storage object for entities.
 */
let storage: Record<string, Entity[]> = {};

/**
 * This database is simply an interface for a JSON object.
 * Use this database interface for testing and mocking APIs.
 */
export const memoryDb: Database = {
  initialize: (initialStorage: Record<string, Entity[]> = {}) => {
    storage = initialStorage;
  },
  create(store) {
    const state = store.getState();
    Object.keys(state).forEach((sliceKey) => {
      const slice: EntityState<Entity> = state[sliceKey];
      if (slice.entities) {
        const entities: Entity[] = Object.keys(slice.entities).map(
          (entityKey) => slice.entities[entityKey],
        ).filter((entity) => !!entity) as Entity[];
        storage[sliceKey] = entities;
      }
    });
    return true;
  },
  update(store) {
    throw new Error('Function not implemented.');
  },
  delete(references) {
    throw new Error('Function not implemented.');
  },
  select(select) {
    const result: Record<string, any[]> = {};

    Object.keys(select).every((selectKey) => {
      const query = select[selectKey];

      /**
       * Skip if the query is undefined or key doesn't exist on storage.
       */
      if (!query || !storage[selectKey]) {
        return true;
      }
      result[selectKey] = [];

      /**
       * Loop through the query properties.
       */
      Object.keys(query).every((queryKey) => {
        const filter = query[queryKey];
        const limit = (query.$limit || 20) <= 20 ? query.$limit : 20;
        let resultSlice = storage[selectKey].slice(0, limit);

        if (!filter) {
          result[selectKey] = resultSlice;
          return true;
        }

        if (filter.$eq) {
          resultSlice = resultSlice.filter((entity) => entity[queryKey] === filter.$eq);
        }

        result[selectKey] = resultSlice;
        return true;
      });

      return true;
    });

    return result;
  },
};

export default memoryDb;
