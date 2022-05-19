---
to: <%= `packages/amnis-state/src/slices/${category}/${name}Set.ts` %>
---
import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { <%= Name %>, <%= Name %>Set } from './<%= h.changeCase.camel(name) %>Set.types';

const initialState: <%= Name %>Set = {
  focusedId: null
};

const adapter = createEntityAdapter<<%= Name %>>({
  // Selects the entity by a specific field on the object. Typically `id`.
  selectId: (entity) => entity.id,
  // Defines how the entities should be sorted. See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
  //sortComparer: (a, b) => 0,
});

export const <%= h.changeCase.camel(name) %>SetSlice = createSlice({
  name: '<%= h.changeCase.camel(name) %>',
  initialState: adapter.getInitialState(initialState),
  reducers: {
    /**
     * Accepts a single entity, and adds it if it's not already present.
     */
    addOne: adapter.addOne,

    /**
    * Accepts an array of entities or an object in the shape of `Record<EntityId, T>`, and adds them if not already present.
    */
    addMany: adapter.addMany,

    /**
    * Accepts a single entity and adds or replaces it
    */
    setOne: adapter.setOne,

    /**
    * Accepts an array of entities or an an object in the shape of `Record<EntityId, T>`, and adds or replaces them.
    */
    setMany: adapter.setMany,

    /**
    * accepts an array of entities or an object in the shape of `Record<EntityId, T>`, and replaces all existing entities with the values in the array.
    */
    setAll: adapter.setAll,

    /**
    * Accepts a single entity ID value, and removes the entity with that ID if it exists.
    */
    removeOne: adapter.removeOne,

    /**
    * Accepts an array of entity ID values, and removes each entity with those IDs if they exist.
    */
    removeMany: adapter.removeMany,

    /**
    * Removes all entities from the entity state object.
    */
    removeAll: adapter.removeAll,

    /**
    * Accepts an "update object" containing an entity ID and an object containing one or more new field values to update inside a changes field, and performs a shallow update on the corresponding entity.
    */
    updateOne: adapter.updateOne,

    /**
    * Accepts an array of update objects, and performs shallow updates on all corresponding entities.
    */
    updateMany: adapter.updateMany,

    /**
    * Accepts a single entity. If an entity with that ID exists, it will perform a shallow update and the specified fields will be merged into the existing entity, with any matching fields overwriting the existing values. If the entity does not exist, it will be added.
    */
    upsertOne: adapter.upsertOne,

    /**
    * Accepts an array of entities or an object in the shape of `Record<EntityId, T>` that will be shallowly upserted.
    */
    upsertMany: adapter.upsertMany,

    /**
     * Sets the focus on a specific entity in the set.
     */
    setFocus: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.entities[id]) {
        state.focusedId = id;
      }
    },

    /**
     * Clears the focus on any entity.
     */
    clearFocus: (state) => {
      state.focusedId = null;
    }

  }
});

export const <%= h.changeCase.camel(name) %>SetActions = <%= h.changeCase.camel(name) %>SetSlice.actions;

/** ********************************************************************************
 * Selectors
 */
export const <%= h.changeCase.camel(name) %>SetSelectors = adapter.getSelectors<RootState>((state) => state.<%= h.changeCase.camel(name) %>Set);

/**
 * Selects the mapped entity.
 */
export const <%= h.changeCase.camel(name) %>SetSelectMap: EntityMapMethod<<%= Name %>> = (state, <%= h.changeCase.camel(name) %>Id, depth = 3) => {
  const <%= h.changeCase.camel(name) %> = <%= h.changeCase.camel(name) %>SetSelectors.selectById(state, <%= h.changeCase.camel(name) %>Id);
  if (!<%= h.changeCase.camel(name) %> || depth <= 0) {
    return;
  }
  return {
    ...<%= h.changeCase.camel(name) %>
  };
};
