import type {
  Entity,
  State,
  Database,
  ResultCreate,
  ResultRead,
  ResultUpdate,
  ResultDelete,
  UpdateEntity,
} from '@amnis/core/index';

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
  create(state) {
    const result: ResultCreate = {};

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
        if (!storage[sliceKey]) {
          storage[sliceKey] = {};
        }
        if (storage[sliceKey][entityId]) {
          return true;
        }
        if (!result[sliceKey]) {
          result[sliceKey] = [];
        }
        storage[sliceKey][entityId] = entity;
        result[sliceKey].push(entity);
        return true;
      });
      return true;
    });

    return result;
  },
  update(state) {
    const result: ResultUpdate = {};

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
        if (!storage[sliceKey]) {
          return true;
        }
        if (!storage[sliceKey][entityId]) {
          return true;
        }
        if (!result[sliceKey]) {
          result[sliceKey] = [] as UpdateEntity[];
        }
        storage[sliceKey][entityId] = {
          ...storage[sliceKey][entityId],
          ...entity,
        };
        result[sliceKey].push(storage[sliceKey][entityId]);
        return true;
      });

      return true;
    });

    return result;
  },
  delete(state) {
    const result: ResultDelete = {};

    Object.keys(state).every((sliceKey) => {
      if (!storage[sliceKey]) {
        return true;
      }
      const references = state[sliceKey];

      references.forEach((ref) => {
        if (storage[sliceKey][ref]) {
          delete storage[sliceKey][ref];
          if (!result[sliceKey]) {
            result[sliceKey] = [];
          }
          result[sliceKey].push(ref);
        }
      });

      return true;
    });

    return result;
  },
  read(select) {
    const result: ResultRead = {};

    Object.keys(select).every((selectKey) => {
      const query = select[selectKey]?.$query || {};

      /**
       * Skip if the query is undefined or key doesn't exist on storage.
       */
      if (!query || !storage[selectKey]) {
        return true;
      }

      /**
       * Ensure delete-marked entities are not selected by default.
       */
      if (query.delete === undefined) {
        query.delete = { $eq: false };
      }

      result[selectKey] = Object.values(storage[selectKey]);

      /**
       * Loop through the query properties.
       */
      Object.keys(query).forEach((queryKey) => {
        const entityKey = queryKey as keyof Entity;
        const filter = query[queryKey];
        const limit = 20;

        result[selectKey] = result[selectKey].filter((entity) => {
          if (!filter) {
            return true;
          }

          if (filter.$eq !== undefined && filter.$eq === entity[entityKey]) {
            return true;
          }

          return false;
        }).slice(0, limit);
      });

      return true;
    });

    return result;
  },
};

export default memory;
