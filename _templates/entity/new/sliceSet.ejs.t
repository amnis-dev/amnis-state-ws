---
to: <%= `packages/amnis-state/src/${name}/${name}Set.ts` %>
---
import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { EntityCreate } from '@amnis/core/entity.types';
import { entityCreate } from '@amnis/core/entity';
import type {
  <%= Name %>,
  <%= Name %>Set,
  <%= Name %>SetPayloadSetFocused,
  <%= Name %>SetPayloadSetSelected,
} from './<%= name %>.types';
import { <%= name %>InitialState } from './<%= name %>';

const adapter = createEntityAdapter<<%= Name %>>({
  // Selects the entity by a specific field on the object. Typically `id`.
  selectId: (entity) => entity.id,
  // Defines how the entities should be sorted. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
  // sortComparer: (a, b) => 0,
});

export const <%= name %>SetInitialState = adapter.getInitialState({
  active: <%= name %>InitialState.id as EntityReference<<%= Name %>>,
  focused: null,
  selected: [],
} as <%= Name %>Set);

export const <%= name %>SetSlice = createSlice({
  name: '<%= name %>',
  initialState: <%= name %>SetInitialState,
  reducers: {
    /**
     * Creates a new <%= Name %> entity.
     */
    create: (state, action: PayloadAction<EntityCreate<<%= Name %>>>) => {
      adapter.addOne(state, entityCreate(action.payload));
    },

    /**
     * Sets the focus on a specific entity in the set.
     */
    setFocus: (state, action: PayloadAction<<%= Name %>SetPayloadSetFocused>) => {
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
    setSelected: (state, action: PayloadAction<<%= Name %>SetPayloadSetSelected>) => {
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

export const <%= name %>SetReducer = <%= name %>SetSlice.reducer;

export const <%= name %>SetActions = <%= name %>SetSlice.actions;

export default <%= name %>Set;
