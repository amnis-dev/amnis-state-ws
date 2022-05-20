import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { EntityCreate, EntityReference } from '@amnis/core/entity.types';
import { entityCreate } from '@amnis/core/entity';
import type {
  User,
  UserSet,
  UserSetPayloadSetFocused,
  UserSetPayloadSetSelected,
} from './user.types';
import { userInitialState } from './user';

const adapter = createEntityAdapter<User>({
  // Selects the entity by a specific field on the object. Typically `id`.
  selectId: (entity) => entity.id,
  // Defines how the entities should be sorted. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
  // sortComparer: (a, b) => 0,
});

export const userSetInitialState = adapter.getInitialState({
  active: userInitialState.id as EntityReference<User>,
  focused: null,
  selected: [],
} as UserSet);

export const userSetSlice = createSlice({
  name: 'userSet',
  initialState: userSetInitialState,
  reducers: {
    /**
     * Creates a new User entity.
     */
    create: (state, action: PayloadAction<EntityCreate<User>>) => {
      adapter.addOne(state, entityCreate(action.payload));
    },

    /**
     * Sets the focus on a specific entity in the set.
     */
    setFocus: (state, action: PayloadAction<UserSetPayloadSetFocused>) => {
      const id = action.payload;
      if (state.entities[id]) {
        state.focused = id;
      }
    },

    /**
     * Clears the focus on any entity.
     */
    clearFocus: (state) => {
      state.focused = null;
    },

    /**
     * Sets the focus on a specific entity in the set.
     */
    setSelected: (state, action: PayloadAction<UserSetPayloadSetSelected>) => {
      const selections = action.payload;
      state.selected = selections;
    },

    /**
     * Clears entity selection.
     */
    clearSelected: (state) => {
      state.selected = [];
    },

  },
});

export const userSetReducer = userSetSlice.reducer;

export const userSetActions = userSetSlice.actions;

export default userSetSlice;
