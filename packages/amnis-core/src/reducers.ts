/* eslint-disable @typescript-eslint/ban-ts-comment */
import type {
  ActionReducerMapBuilder,
  EntityAdapter,
  PayloadAction,
} from '@reduxjs/toolkit';
import {
  Entity,
  MetaState,
  entityCreate,
  metaInitial,
  EntityCreator,
  EntityUpdater,
} from './entity/index.js';
import { coreActions } from './actions.js';
import type { UID } from './types.js';
import { diffCompare } from './diff.js';

export interface MetaOptions {
  active?: boolean;
  focused?: boolean;
  selection?: boolean;
}

export interface CreatePayload<C extends EntityCreator> {
  entity: Entity<C>;
  meta?: MetaOptions;
}

function setMeta<C extends EntityCreator>(state: MetaState<C>, ref: C['$id'], meta?: MetaOptions) {
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

export function coreReducers<C extends EntityCreator>(
  key: string,
  adapter: EntityAdapter<Entity<C>>,
) {
  return {
    /**
     * Creates a new entity.
     */
    create: {
      reducer: (
        state: MetaState<C>,
        action: PayloadAction<CreatePayload<C>>,
      ) => {
        const { entity, meta } = action.payload;
        adapter.addOne(state, entity);
        setMeta(state, entity.$id, meta);
      },
      prepare: (creator: C, meta?: MetaOptions) => ({
        payload: {
          entity: entityCreate(creator),
          meta,
        },
      }),
    },

    /**
     * Creates several new entities.
     */
    createMany: {
      reducer: (
        state: MetaState<C>,
        action: PayloadAction<Entity<C>[]>,
      ) => {
        adapter.addMany(state, action.payload);
      },
      prepare: (creators: C[]) => ({
        payload: creators.map((creator) => entityCreate(creator)),
      }),
    },

    /**
     * Inserts an entity
     */
    insert: {
      reducer: (
        state: MetaState<C>,
        action: PayloadAction<CreatePayload<C>>,
      ) => {
        const { entity, meta } = action.payload;
        adapter.addOne(state, entity);
        setMeta(state, entity.$id, meta);
      },
      prepare: (entity: Entity<C>, meta?: MetaOptions) => ({
        payload: {
          entity,
          meta,
        },
      }),
    },

    /**
     * Updates an existing entity.
     */
    update: {
      reducer: (
        state: MetaState<C>,
        action: PayloadAction<EntityUpdater<C>>,
      ) => {
        const { $id, ...other } = action.payload;
        const changes = other as Entity<C>;

        const entity = adapter.getSelectors().selectById(state, $id);

        if (!entity) {
          return;
        }

        /**
         * Store the original object if it doesn't exist on state.
         */
        if (state.original[$id] === undefined) {
          state.original[$id] = entity;
        }

        /**
         * Perform a diff compare.
         */
        const diffResult = diffCompare<Entity<C>>(
          { ...entity, ...changes },
          state.original[$id] as Entity<C>,
          { includeEntityKeys: false },
        );

        if (diffResult.length === 0 && !entity.committed) {
          changes.committed = true;
        }

        if (diffResult.length > 0 && entity.committed) {
          changes.committed = false;
        }

        if (diffResult.length) {
          state.differences[$id] = diffResult;
        }

        if (!diffResult.length && state.differences[$id]) {
          delete state.differences[$id];
          delete state.original[$id];
        }

        /**
         * Update the entity.
         */
        adapter.updateOne(state, {
          id: $id,
          changes,
        });
      },
      prepare: (updater: EntityUpdater<C>) => ({ payload: updater }),
    },

    /**
     * Delete and entity from the state.
     */
    delete: {
      reducer: (
        state: MetaState<C>,
        action: PayloadAction<UID<C>>,
      ) => {
        const id = action.payload;
        adapter.removeOne(state, id);
      },
      prepare: (entityId: UID<C>) => ({ payload: entityId }),
    },

    /**
     * Sets active entity.
     */
    activeSet: (
      state: MetaState<C>,
      action: PayloadAction<UID<C>>,
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
      state: MetaState<C>,
    ) => {
      state.active = null;
    },

    /**
     * Sets focused entity.
     */
    focusSet: (
      state: MetaState<C>,
      action: PayloadAction<UID<C>>,
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
      state: MetaState<C>,
    ) => {
      state.focused = null;
    },

    /**
     * Sets the focus on a specific entity in the set.
     */
    selectionSet: (
      state: MetaState<C>,
      action: PayloadAction<UID<C>[]>,
    ) => {
      const selection = action.payload;
      state.selection = [...selection];
    },

    /**
     * Clears entity selection.
     */
    selectionClear: (
      state: MetaState<C>,
    ) => {
      state.selection = [];
    },
  };
}

export function coreExtraReducers<C extends EntityCreator>(
  key: string,
  adapter: EntityAdapter<Entity<C>>,
  builder: ActionReducerMapBuilder<MetaState<C>>,
) {
  builder.addCase(coreActions.insert, (state, action) => {
    const { payload } = action;
    if (payload[key] && Array.isArray(payload[key])) {
      /** @ts-ignore */
      adapter.upsertMany<MetaState<E>>(state, payload[key]);
    }
  });

  builder.addCase(coreActions.create, (state, action) => {
    const { payload } = action;
    if (payload[key] && Array.isArray(payload[key])) {
      const entityCreators = payload[key];
      const entities = entityCreators.map((entityCreator) => entityCreate(entityCreator));
      /** @ts-ignore */
      adapter.addMany<MetaState<E>>(state, entities);
    }
  });

  builder.addCase(coreActions.update, (state, action) => {
    const { payload } = action;
    if (payload[key] && Array.isArray(payload[key])) {
      /** @ts-ignore */
      adapter.updateMany<MetaState<E>>(state, payload[key]);
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
    const metaDefault = metaInitial<C>();

    state.active = metaDefault.active;
    state.focused = metaDefault.focused;
    state.selection = metaDefault.selection;

    Object.keys(state.original).forEach((k) => {
      delete state.original[k as keyof typeof state.original];
    });
    Object.keys(state.differences).forEach((k) => {
      delete state.differences[k as keyof typeof state.differences];
    });
    /** @ts-ignore */
    adapter.removeAll(state);
  });
}

export default { coreReducers, coreExtraReducers };
