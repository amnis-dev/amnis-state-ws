---
to: <%= `packages/amnis-state/src/${name}/${name}.ts` %>
---
import { createSlice } from '@reduxjs/toolkit';
import {
  entityCreate,
} from '@amnis/core/entity';
import type {
  <%= Name %>,
  <%= Name %>ActionCreate,
} from './<%= name %>.types';

const initialState: <%= Name %> = entityCreate();

export const <%= name %>Slice = createSlice({
  name: '<%= name %>',
  initialState,
  reducers: {
    set: (state, action: <%= Name %>ActionCreate) => (entityCreate(action.payload)),
  },
});

export const <%= name %>Actions = <%= name %>Slice.actions;

