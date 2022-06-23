/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  ActionReducerMapBuilder,
  EntityAdapter,
  PayloadAction,
} from '@reduxjs/toolkit';
import {
  entityCreate,
} from './entity';
import { coreActions } from './actions';
import type {
  Entity,
  EntityExtension,
  EntityPartial,
  MetaState,
  Reference,
} from './types';

export function coreReducers<E extends Entity>(key: string, adapter: EntityAdapter<E>) {
  return {
    /**
     * Creates a new entity.
     */
    create: {
      reducer: (
        state: MetaState<E>,
        action: PayloadAction<E>,
      ) => {
        adapter.addOne(state, action.payload);
      },
      prepare: (entityNew: EntityExtension<E>) => ({ payload: entityCreate(key, entityNew) }),
    },

    /**
     * Creates several new entities.
     */
    createMany: {
      reducer: (
        state: MetaState<E>,
        action: PayloadAction<E[]>,
      ) => {
        adapter.addMany(state, action.payload);
      },
      prepare: (entitiesNew: EntityExtension<E>[]) => ({
        payload: entitiesNew.map((entityNew) => entityCreate(key, entityNew)),
      }),
    },

    /**
     * Updates an existing entity.
     */
    update: {
      reducer: (
        state: MetaState<E>,
        action: PayloadAction<{ $id: string } & EntityPartial<E>>,
      ) => {
        const { $id, ...changes } = action.payload;
        adapter.updateOne(state, {
          id: $id,
          changes: changes as Partial<E>,
        });
      },
      prepare: (entityUpdate: { $id: string } & EntityPartial<E>) => ({ payload: entityUpdate }),
    },

    /**
     * Sets active entity.
     */
    activeSet: (
      state: MetaState<E>,
      action: PayloadAction<Reference<E>>,
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
      state: MetaState<E>,
    ) => {
      state.active = null;
    },

    /**
     * Sets focused entity.
     */
    focusSet: (
      state: MetaState<E>,
      action: PayloadAction<Reference<E>>,
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
      state: MetaState<E>,
    ) => {
      state.focused = null;
    },

    /**
     * Sets the focus on a specific entity in the set.
     */
    selectionSet: (
      state: MetaState<E>,
      action: PayloadAction<Reference<E>[]>,
    ) => {
      const selection = action.payload;
      state.selection = [...selection];
    },

    /**
     * Clears entity selection.
     */
    selectionClear: (
      state: MetaState<E>,
    ) => {
      state.selection = [];
    },
  };
}

export function coreExtraReducers<E extends Entity>(
  key: string,
  adapter: EntityAdapter<E>,
  builder: ActionReducerMapBuilder<MetaState<E>>,
) {
  builder.addCase(coreActions.create, (state, action) => {
    const { payload } = action;
    if (Array.isArray(payload[key])) {
      /** @ts-ignore */
      adapter.addMany<MetaState<E>>(state, payload[key]);
    }
  });

  builder.addCase(coreActions.update, (state, action) => {
    const { payload } = action;
    if (Array.isArray(payload[key])) {
      /** @ts-ignore */
      adapter.upsertMany<MetaState<E>>(state, payload[key]);
    }
  });
}

export default { coreReducers, coreExtraReducers };
