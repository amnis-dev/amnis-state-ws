import type { Entity } from '@amnis/core/entity';
import type {
  State,
  StateCreate,
  StateDelete,
} from '@amnis/core/state';
import { Identifier } from '@amnis/core/types';
import type { Database } from '../types';

/**
 * Storage type.
 */
export type MemoryStorage = State<Record<string, Entity>>;

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
  /**
   * ================================================================================
   * CREATE
   * ----------------------------------------
   */
  create: async (state) => {
    const result: StateCreate = {};

    Object.keys(state).every((sliceKey) => {
      const col: Entity[] = state[sliceKey];
      if (!Array.isArray(col)) {
        return true;
      }
      col.every((entity) => {
        const entityId = entity.$id;
        if (!entity || !entityId) {
          return true;
        }

        const storageKey = sliceKey;

        if (!storage[storageKey]) {
          storage[storageKey] = {};
        }
        if (storage[storageKey][entityId]) {
          return true;
        }
        if (!result[sliceKey]) {
          result[sliceKey] = [];
        }
        storage[storageKey][entityId] = entity;
        result[sliceKey].push(entity);
        return true;
      });
      return true;
    });

    return result;
  },
  /**
   * ================================================================================
   * READ
   * ----------------------------------------
   */
  read: async (select, controls = {}) => {
    const { scope, subject } = controls;
    const result: StateCreate = {};

    Object.keys(select).every((selectKey) => {
      const storageKey = selectKey;

      /**
       * Ensure this selection is within auth scope.
       */
      if (scope && !scope[selectKey]) {
        return true;
      }

      const query = select[selectKey]?.$query || {};

      /**
       * Skip if the query is undefined or key doesn't exist on storage.
       */
      if (!query || !storage[storageKey]) {
        return true;
      }

      /**
       * Ensure delete-marked entities are not selected by default.
       */
      if (query.delete === undefined) {
        query.delete = { $eq: false };
      }

      result[selectKey] = Object.values(storage[storageKey]);

      /**
       * Loop through the query properties.
       */
      Object.keys(query).forEach((queryKey) => {
        const entityKey = queryKey as keyof Entity;
        const filter = query[queryKey];
        const limit = 20;

        result[selectKey] = result[selectKey].filter((entity) => {
          /**
           * Check to ensure this entity is within the scope.
           * If the scope is owner only, the entity must have the owner id match the subject.
           */
          if (
            scope
            && scope[selectKey] === 'owned'
            && (entity.$owner !== subject && !entity.$readers.includes(subject as Identifier))
          ) {
            return false;
          }

          if (!filter) {
            return true;
          }

          if (filter.$eq !== undefined && filter.$eq === entity[entityKey]) {
            return true;
          }

          if (filter.$in !== undefined && filter.$in.includes(entity[entityKey])) {
            return true;
          }

          return false;
        }).slice(0, limit);
      });

      return true;
    });

    return result;
  },
  /**
   * ================================================================================
   * UPDATE
   * ----------------------------------------
   */
  update: async (state, controls = {}) => {
    const { scope, subject } = controls;
    const result: StateCreate = {};

    Object.keys(state).every((sliceKey) => {
      const storageKey = sliceKey;

      /**
       * Ensure this selection is within auth scope.
       */
      if (scope && !scope[sliceKey]) {
        return true;
      }

      const col = state[sliceKey];
      if (!Array.isArray(col)) {
        return true;
      }

      col.every((entity) => {
        const entityId = entity.$id;
        if (!entity || !entityId) {
          return true;
        }
        if (!storage[storageKey]) {
          return true;
        }
        if (!storage[storageKey][entityId]) {
          return true;
        }
        /**
         * Check to ensure this entity is within the scope.
         * If the scope is owner only, the entity must have the owner id match the subject.
         */
        if (scope && scope[sliceKey] === 'owned' && storage[storageKey][entityId].$owner !== subject) {
          return false;
        }
        if (!result[sliceKey]) {
          result[sliceKey] = [];
        }
        storage[storageKey][entityId] = {
          ...storage[storageKey][entityId],
          ...entity,
        };
        result[sliceKey].push(storage[storageKey][entityId]);
        return true;
      });

      return true;
    });

    return result;
  },
  /**
   * ================================================================================
   * DELETE
   * ----------------------------------------
   */
  delete: async (state, controls = {}) => {
    const { scope, subject } = controls;
    const result: StateDelete = {};

    Object.keys(state).every((sliceKey) => {
      const storageKey = sliceKey;

      /**
       * Ensure this selection is within auth scope.
       */
      if (scope && !scope[sliceKey]) {
        return true;
      }

      if (!storage[storageKey]) {
        return true;
      }
      const references = state[sliceKey];

      references.every((ref) => {
        if (!storage[storageKey][ref]) {
          return true;
        }
        /**
         * Check to ensure this entity is within the scope.
         * If the scope is owner only, the entity must have the owner id match the subject.
         */
        if (scope && scope[sliceKey] === 'owned' && storage[storageKey][ref].$owner !== subject) {
          return false;
        }

        delete storage[storageKey][ref];
        if (!result[sliceKey]) {
          result[sliceKey] = [];
        }
        result[sliceKey].push(ref);

        return true;
      });

      return true;
    });

    return result;
  },
};

export default memory;
