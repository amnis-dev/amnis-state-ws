/* eslint-disable @typescript-eslint/ban-ts-comment */
import type {
  EntityAdapter, PayloadAction,
} from '@reduxjs/toolkit';
import {
  entityCreate,
} from './entity';
import type {
  Entity,
  EntityCreate,
  EntityPayloadActiveSet,
  EntityPayloadFocusSet,
  EntityPayloadSelectionSet,
  EntityState,
} from './entity.types';

export function entityReducers<E extends Entity>(adapter: EntityAdapter<E>) {
  return {
    /**
     * Creates a new entity.
     */
    create: {
      reducer: (
        state: EntityState<E>,
        action: PayloadAction<E>,
      ) => {
        adapter.addOne(state, action.payload);
      },
      prepare: (entityNew: EntityCreate<E>) => ({ payload: entityCreate(entityNew) }),
    },

    /**
     * Sets active entity.
     */
    activeSet: (
      state: EntityState<E>,
      action: PayloadAction<EntityPayloadActiveSet<E>>,
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
      state: EntityState<E>,
    ) => {
      state.active = null;
    },

    /**
     * Sets focused entity.
     */
    focusSet: (
      state: EntityState<E>,
      action: PayloadAction<EntityPayloadFocusSet<E>>,
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
      state: EntityState<E>,
    ) => {
      state.focused = null;
    },

    /**
     * Sets the focus on a specific entity in the set.
     */
    selectionSet: (
      state: EntityState<E>,
      action: PayloadAction<EntityPayloadSelectionSet<E>>,
    ) => {
      const selection = action.payload;
      state.selection = [...selection];
    },

    /**
     * Clears entity selection.
     */
    selectionClear: (
      state: EntityState<E>,
    ) => {
      state.selection = [];
    },
  };
}

export default entityReducers;
