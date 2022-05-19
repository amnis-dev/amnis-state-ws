---
to: <%= `packages/amnis-state/src/${category}/${name}/${name}Set.ts` %>
---
import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { <%= Name %>, <%= Name %>Set } from './<%= h.changeCase.camel(name) %>Set.types';

const initialState: <%= Name %>Set = {
  focused: null;
};

const adapter = createEntityAdapter<<%= Name %>>({
  // Selects the entity by a specific field on the object. Typically `id`.
  selectId: (entity) => entity.id,
  // Defines how the entities should be sorted. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
  // sortComparer: (a, b) => 0,
});

export const <%= h.changeCase.camel(name) %>SetSlice = createSlice({
  name: '<%= h.changeCase.camel(name) %>',
  initialState: adapter.getInitialState(initialState),
  reducers: {

    /**
     * Sets the focus on a specific entity in the set.
     */
    setFocus: (state, action: PayloadAction<string>) => {
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

  },
});

export const <%= h.changeCase.camel(name) %>SetActions = <%= h.changeCase.camel(name) %>SetSlice.actions;

/** ********************************************************************************
 * Selectors
 */
export const <%= h.changeCase.camel(name) %>SetSelectors = adapter.getSelectors<RootState>((state) => state.<%= h.changeCase.camel(name) %>Set);
