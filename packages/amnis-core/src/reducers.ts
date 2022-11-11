/* eslint-disable @typescript-eslint/ban-ts-comment */
import type {
  ActionReducerMapBuilder,
  EntityAdapter,
  PayloadAction,
} from '@reduxjs/toolkit';
import {
  entityCreate,
} from './entity/entity.js';
import { coreActions } from './actions.js';
import type {
  Entity,
  EntityExtension,
  EntityUpdate,
  MetaState,
} from './entity/index.js';
import type { UID } from './types.js';

export interface MetaOptions {
  active?: boolean;
  focused?: boolean;
  selection?: boolean;
}

export interface CreatePayload<E extends Entity> {
  entity: E;
  meta?: MetaOptions;
}

function setMeta<E extends Entity>(state: MetaState<E>, ref: E['$id'], meta?: MetaOptions) {
  if (meta) {
    if (meta.active) {
      state.active = ref;
    }
    if (meta.focused) {
      state.focused = ref;
    }
    if (meta.selection) {
      state.selection.push(ref);
    }
  }
}

export function coreReducers<E extends Entity>(key: string, adapter: EntityAdapter<E>) {
  return {
    /**
     * Creates a new entity.
     */
    create: {
      reducer: (
        state: MetaState<E>,
        action: PayloadAction<CreatePayload<E>>,
      ) => {
        const { entity, meta } = action.payload;
        adapter.addOne(state, entity);
        setMeta(state, entity.$id, meta);
      },
      prepare: (entityNew: EntityExtension<E>, meta?: MetaOptions) => ({
        payload: {
          entity: entityCreate(key, entityNew),
          meta,
        },
      }),
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
        action: PayloadAction<EntityUpdate<E>>,
      ) => {
        const { $id, ...changes } = action.payload;

        /**
         * Store the original object if it doesn't exist on state.
         */
        if (state.original[$id] === undefined && state.entities[$id] !== undefined) {
          Object.assign(state.original[$id], { ...state.entities[$id] });
        }

        /**
         * Update the entity.
         */
        adapter.updateOne(state, {
          id: $id,
          changes: changes as Partial<E>,
        });
      },
      prepare: (entityUpdate: EntityUpdate<E>) => ({ payload: entityUpdate }),
    },

    /**
     * Delete and entity from the state.
     */
    delete: {
      reducer: (
        state: MetaState<E>,
        action: PayloadAction<UID<E>>,
      ) => {
        const id = action.payload;
        adapter.removeOne(state, id);
      },
      prepare: (entityId: UID<E>) => ({ payload: entityId }),
    },

    /**
     * Sets active entity.
     */
    activeSet: (
      state: MetaState<E>,
      action: PayloadAction<UID<E>>,
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
      action: PayloadAction<UID<E>>,
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
      action: PayloadAction<UID<E>[]>,
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
    if (payload[key] && Array.isArray(payload[key])) {
      /** @ts-ignore */
      adapter.addMany<MetaState<E>>(state, payload[key]);
    }
  });

  builder.addCase(coreActions.update, (state, action) => {
    const { payload } = action;
    if (payload[key] && Array.isArray(payload[key])) {
      /** @ts-ignore */
      adapter.upsertMany<MetaState<E>>(state, payload[key]);
    }
  });

  builder.addCase(coreActions.delete, (state, action) => {
    const { payload } = action;
    if (payload[key] && Array.isArray(payload[key])) {
      /** @ts-ignore */
      adapter.removeMany<MetaState<E>>(state, payload[key]);

      if (state.active && payload[key].includes(state.active)) {
        state.active = null;
      }

      if (state.focused && payload[key].includes(state.focused)) {
        state.focused = null;
      }

      if (
        state.selection.length > 0
        && payload[key].some((id: UID) => state.selection.includes(id))
      ) {
        state.selection = state.selection.filter((selectionId) => (
          payload[key].includes(selectionId)
        ));
      }
    }
  });

  builder.addCase(coreActions.wipe, (state) => {
    state.active = null;
    state.focused = null;
    state.selection = [];
    /** @ts-ignore */
    adapter.removeAll(state);
  });
}

export default { coreReducers, coreExtraReducers };
