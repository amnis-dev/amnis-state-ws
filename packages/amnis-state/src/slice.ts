import type { EntityAdapter, PayloadAction } from '@reduxjs/toolkit';
import {
  Entity,
  EntityCreate,
  EntityMeta,
  entityCreate,
} from '@amnis/core/entity';
import {
  EntityStatePayloadActiveSet,
  EntityStatePayloadFocusSet,
  EntityStatePayloadSelectionSet,
  EntityState,
} from './slice.types';

export function sliceEntityReducers<E extends Entity>(adapter: EntityAdapter<E>) {
  return {
    /**
     * Creates a new entity.
     */
    create: (
      state: EntityState<E, EntityMeta<E>>,
      action: PayloadAction<EntityCreate<E>>,
    ) => {
      adapter.addOne(state, entityCreate(action.payload));
    },

    /**
     * Sets active entity.
     */
    activeSet: (
      state: EntityState<E, EntityMeta<E>>,
      action: PayloadAction<EntityStatePayloadActiveSet<E>>,
    ) => {
      const id = action.payload;
      if (state.entities[id]) {
        state.active = id;
      }
    },

    /**
     * Clears active entity.
     */
    activeClear: (
      state: EntityState<E, EntityMeta<E>>,
    ) => {
      state.active = null;
    },

    /**
     * Sets focused entity.
     */
    focusSet: (
      state: EntityState<E, EntityMeta<E>>,
      action: PayloadAction<EntityStatePayloadFocusSet<E>>,
    ) => {
      const id = action.payload;
      if (state.entities[id]) {
        state.focused = id;
      }
    },

    /**
     * Clears the focus on any entity.
     */
    focusClear: (
      state: EntityState<E, EntityMeta<E>>,
    ) => {
      state.focused = null;
    },

    /**
     * Sets the focus on a specific entity in the set.
     */
    selectionSet: (
      state: EntityState<E, EntityMeta<E>>,
      action: PayloadAction<EntityStatePayloadSelectionSet<E>>,
    ) => {
      const selection = action.payload;
      state.selection = [...selection];
    },

    /**
     * Clears entity selection.
     */
    selectionClear: (
      state: EntityState<E, EntityMeta<E>>,
    ) => {
      state.selection = [];
    },
  };
}

export default { sliceEntityReducers };
