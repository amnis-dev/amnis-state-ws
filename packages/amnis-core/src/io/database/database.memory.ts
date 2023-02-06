import { UID } from '../../types.js';
import { uidList } from '../../uid.js';
import { Entity } from '../../entity/index.js';
import {
  GrantScope,
  State,
  StateDeleter,
  StateEntities,
} from '../../state/index.js';
import { Database } from './database.types.js';

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
export function databaseMemoryStorage() {
  return storage;
}

/**
 * Function to clear memory storage.
 */
export function databaseMemoryClear() {
  storage = {};
}

/**
 * This database is simply an interface for a JSON object.
 * Use this database interface for testing and mocking APIs.
 */
export const databaseMemory: Database = {
  initialize: (initialStorage: MemoryStorage = {}) => {
    storage = initialStorage;
  },
  /**
   * ================================================================================
   * CREATE
   * ----------------------------------------
   */
  create: async (state) => {
    const result: StateEntities = {};

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
  read: async (queryState, controls = {}) => {
    const { scope, subject } = controls;
    const result: StateEntities = {};

    Object.keys(queryState).every((queryStateKey) => {
      const storageKey = queryStateKey;

      /**
       * Ensure this queryStateion is within auth scope.
       */
      if (scope && !scope[queryStateKey]) {
        return true;
      }

      const query = queryState[queryStateKey]?.$query || {};

      /**
       * Skip if the query is undefined or key doesn't exist on storage.
       */
      if (!query || !storage[storageKey]) {
        return true;
      }

      /**
       * Ensure delete-marked entities are not queryStateed by default.
       */
      if (query.delete === undefined) {
        query.delete = { $eq: false };
      }

      result[queryStateKey] = Object.values(storage[storageKey]);

      /**
       * Define the start index and limit.
       */
      const start = queryState[queryStateKey].$range?.start ?? 0;
      const limit = queryState[queryStateKey].$range?.limit ?? 20;

      /**
       * Loop through the query properties.
       */
      Object.keys(query).forEach((queryKey) => {
        const entityKey = queryKey as keyof Entity;
        const filter = query[queryKey];

        result[queryStateKey] = result[queryStateKey].filter((entity) => {
          /**
           * Check to ensure this entity is within the scope.
           * If the scope is owner only, the entity must have the owner id match the subject.
           */
          if (
            scope
            && scope[queryStateKey] === GrantScope.Owned
            && subject
            && (entity.$owner !== subject
              && !entity.$readers.includes(subject))
          ) {
            return false;
          }

          if (!filter) {
            return true;
          }

          const filterKeyLength = Object.keys(filter).length;
          let matches = 0;

          if (filter.$eq !== undefined && filter.$eq === entity[entityKey]) {
            matches += 1;
          }

          if (
            filter.$lt !== undefined
            && typeof entity[entityKey] === 'number'
            && (entity[entityKey] as unknown as number) < filter.$lt
          ) {
            matches += 1;
          }

          if (
            filter.$lte !== undefined
            && typeof entity[entityKey] === 'number'
            && (entity[entityKey] as unknown as number) <= filter.$lte
          ) {
            matches += 1;
          }

          if (
            filter.$gt !== undefined
            && typeof entity[entityKey] === 'number'
            && (entity[entityKey] as unknown as number) > filter.$gt
          ) {
            matches += 1;
          }

          if (
            filter.$gte !== undefined
            && typeof entity[entityKey] === 'number'
            && (entity[entityKey] as unknown as number) >= filter.$gte
          ) {
            matches += 1;
          }

          if (filter.$in !== undefined && filter.$in.includes(entity[entityKey])) {
            matches += 1;
          }

          return matches === filterKeyLength;
        }).slice(start, limit + start);
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
    const result: StateEntities = {};

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
        if (
          scope
          && scope[sliceKey] === GrantScope.Owned
          && storage[storageKey][entityId].$owner !== subject
        ) {
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
    const result: StateDeleter = {};

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

      references.every((ref: UID) => {
        if (!storage[storageKey][ref]) {
          return true;
        }
        /**
         * Check to ensure this entity is within the scope.
         * If the scope is owner only, the entity must have the owner id match the subject.
         */
        if (
          scope
          && scope[sliceKey] === GrantScope.Owned
          && storage[storageKey][ref].$owner !== subject
        ) {
          return false;
        }

        delete storage[storageKey][ref];
        if (!result[sliceKey]) {
          result[sliceKey] = uidList();
        }
        result[sliceKey].push(ref);

        return true;
      });

      return true;
    });

    return result;
  },
};

export default databaseMemory;
