import type { Entity, Database } from '@amnis/core/index';
import {
  EntityState,
} from '@reduxjs/toolkit';

/**
 * Storage object for entities.
 */
const storage: Record<string, Entity[]> = {};

/**
 * This database is simply a JavaScript object.
 * Use this database interface for testing and mocking.
 */
export const memoryDb: Database = {
  initialize: () => {
    /**
     * No initialization needed for the memory database.
     */
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
    console.log('Next Storage:', storage);
    return true;
  },
  update(store) {
    throw new Error('Function not implemented.');
  },
  delete(references) {
    throw new Error('Function not implemented.');
  },
  select(query) {
    throw new Error('Function not implemented.');
  },
};

export default memoryDb;
