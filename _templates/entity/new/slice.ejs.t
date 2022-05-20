---
to: <%= `packages/amnis-state/src/${name}/${name}.ts` %>
---
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  entityCreate,
  entityUpdate,
} from '@amnis/core/entity';
import type {
  <%= Name %>,
  <%= Name %>PayloadUpdate,
} from './<%= name %>.types';

export const <%= name %>InitialState: <%= Name %> = entityCreate({
  displayName: 'Unknown',
});

export const <%= name %>Slice = createSlice({
  name: '<%= name %>',
  initialState: <%= name %>InitialState,
  reducers: {
    set: (state, action: PayloadAction<<%= Name %>PayloadUpdate>) => (
      { ...state, ...entityUpdate(state, action.payload) }
    ),
  },
});

export const <%= name %>Reducer = <%= name %>Slice.reducer;

export const <%= name %>Actions = <%= name %>Slice.actions;

export default <%= name %>Slice;

