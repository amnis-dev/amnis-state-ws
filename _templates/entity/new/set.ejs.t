---
to: <%= `packages/amnis-state/src/${name}/${name}Set.ts` %>
---
import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { EntityCreate } from '@amnis/core/entity.types';
import { entityCreate } from '@amnis/core/entity';
import type {
  <%= Name %>,
  <%= Name %>Set,
  <%= Name %>SetActionSetFocused,
  <%= Name %>SetActionSetSelected,
} from './<%= name %>.types';

const initialState: <%= Name %>Set = {
  focused: null,
  selected: [],
};

const adapter = createEntityAdapter<<%= Name %>>({
  // Selects the entity by a specific field on the object. Typically `id`.
  selectId: (entity) => entity.id,
  // Defines how the entities should be sorted. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
  // sortComparer: (a, b) => 0,
});

export const <%= name %>SetSlice = createSlice({
  name: '<%= name %>',
  initialState: adapter.getInitialState(initialState),
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
    setFocus: (state, action: <%= Name %>SetActionSetFocused) => {
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
    setSelected: (state, action: <%= Name %>SetActionSetSelected) => {
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

export const <%= name %>SetActions = <%= name %>SetSlice.actions;
