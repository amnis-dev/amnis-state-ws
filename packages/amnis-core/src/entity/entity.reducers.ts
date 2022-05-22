/* eslint-disable @typescript-eslint/ban-ts-comment */
import type {
  EntityAdapter,
  PayloadAction,
  ActionReducerMapBuilder,
} from '@reduxjs/toolkit';
import { Immutable } from 'immer';
import { WritableDraft } from 'immer/dist/internal';
import {
  entityCreate,
} from './entity';
import {
  entityActions,
} from './entity.actions';
import type {
  Entity,
  EntityCreate,
  EntityMeta,
  EntityState,
  EntityPayloadActiveSet,
  EntityPayloadFocusSet,
  EntityPayloadSelectionSet,
} from './entity.types';

export function entityReducers<E extends Entity>(
  adapter: EntityAdapter<E>,
  builder: ActionReducerMapBuilder<EntityState<E>>,
) {
  builder.addCase(entityActions.create, (state, action) => {
    /** @ts-ignore */
    adapter.addOne<EntityState<E>>(state, entityCreate(action.payload));
  });
}

export default entityReducers;

// export function entityReducers<E extends Entity>(adapter: EntityAdapter<E>) {
//   return {
//     /**
//      * Creates a new entity.
//      */
//     create: (
//       state: EntityState<E, EntityMeta<E>>,
//       action: PayloadAction<EntityCreate<E>>,
//     ) => {
//       adapter.addOne(state, entityCreate(action.payload));
//     },

//     /**
//      * Sets active entity.
//      */
//     activeSet: (
//       state: EntityState<E, EntityMeta<E>>,
//       action: PayloadAction<EntityPayloadActiveSet<E>>,
//     ) => {
//       const id = action.payload;
//       if (state.entities[id]) {
//         state.active = id;
//       }
//     },

//     /**
//      * Clears active entity.
//      */
//     activeClear: (
//       state: EntityState<E, EntityMeta<E>>,
//     ) => {
//       state.active = null;
//     },

//     /**
//      * Sets focused entity.
//      */
//     focusSet: (
//       state: EntityState<E, EntityMeta<E>>,
//       action: PayloadAction<EntityPayloadFocusSet<E>>,
//     ) => {
//       const id = action.payload;
//       if (state.entities[id]) {
//         state.focused = id;
//       }
//     },

//     /**
//      * Clears the focus on any entity.
//      */
//     focusClear: (
//       state: EntityState<E, EntityMeta<E>>,
//     ) => {
//       state.focused = null;
//     },

//     /**
//      * Sets the focus on a specific entity in the set.
//      */
//     selectionSet: (
//       state: EntityState<E, EntityMeta<E>>,
//       action: PayloadAction<EntityPayloadSelectionSet<E>>,
//     ) => {
//       const selection = action.payload;
//       state.selection = [...selection];
//     },

//     /**
//      * Clears entity selection.
//      */
//     selectionClear: (
//       state: EntityState<E, EntityMeta<E>>,
//     ) => {
//       state.selection = [];
//     },
//   };
// }

// export default { entityReducers };
