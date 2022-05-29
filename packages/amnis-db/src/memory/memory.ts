import type { Entity, Database, Result } from '@amnis/core/index';
import type {
  EntityState,
} from '@reduxjs/toolkit';

/**
 * Storage type.
 */
export type MemoryStorage = Record<string, Record<string, Entity>>;

/**
 * Storage object for entities.
 */
let storage: MemoryStorage = {};

/**
 * Function to get memory storage.
 */
export function memoryStorage() {
  return storage;
}

/**
 * Function to clear memory storage.
 */
export function memoryClear() {
  storage = {};
}

/**
 * This database is simply an interface for a JSON object.
 * Use this database interface for testing and mocking APIs.
 */
export const memory: Database = {
  initialize: (initialStorage: MemoryStorage = {}) => {
    storage = initialStorage;
  },
  create(state) {
    Object.keys(state).every((sliceKey) => {
      const slice: EntityState<Entity> = state[sliceKey];
      if (!slice?.entities) {
        return true;
      }
      Object.keys(slice.entities).every(
        (entityKey) => {
          const entity = slice?.entities[entityKey];
          if (!entity) {
            return true;
          }
          if (!storage[sliceKey]) {
            storage[sliceKey] = {};
          }
          if (storage[sliceKey][entityKey]) {
            return true;
          }
          if (!storage[sliceKey]) {
            storage[sliceKey] = {};
          }
          storage[sliceKey][entityKey] = entity;
          return true;
        },
      );
      return true;
    });

    const result = Object.keys(storage).reduce<Result>((value, storageKey) => {
      value[storageKey] = Object.values(storage[storageKey]);
      return value;
    }, {});

    return result;
  },
  update(state) {
    Object.keys(state).every((sliceKey) => {
      const slice: EntityState<Entity> = state[sliceKey];
      if (!slice?.entities) {
        return true;
      }

      Object.keys(slice.entities).every(
        (entityKey) => {
          const entity = slice?.entities[entityKey];
          if (!entity) {
            return true;
          }
          if (!storage[sliceKey]) {
            return true;
          }
          if (!storage[sliceKey][entityKey]) {
            return true;
          }
          storage[sliceKey][entityKey] = {
            ...storage[sliceKey][entityKey],
            ...entity,
          };
          return true;
        },
      );

      return true;
    });

    const result = Object.keys(storage).reduce<Result>((value, storageKey) => {
      value[storageKey] = Object.values(storage[storageKey]);
      return value;
    }, {});

    return result;
  },
  delete(references) {
    throw new Error('Function not implemented.');
  },
  select(select) {
    const result: Result = {};

    Object.keys(select).every((selectKey) => {
      const query = select[selectKey];

      /**
       * Skip if the query is undefined or key doesn't exist on storage.
       */
      if (!query || !storage[selectKey]) {
        return true;
      }

      /**
       * Loop through the query properties.
       */
      Object.keys(query).forEach((queryKey) => {
        const entityKey = queryKey as keyof Entity;
        const filter = query[queryKey];
        const limit = (query.$limit || 20) <= 20 ? query.$limit : 20;

        result[selectKey] = Object.values(storage[selectKey]).slice(0, limit).filter((entity) => {
          if (!filter) {
            return true;
          }

          if (filter.$eq && filter.$eq === entity[entityKey]) {
            return true;
          }

          return false;
        });
      });

      return true;
    });

    return result;
  },
};

export default memory;
