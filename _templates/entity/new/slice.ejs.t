---
to: <%= `packages/amnis-state/src/${category}/${name}/${name}.ts` %>
---
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { <%= Name %> } from './<%= name.toLowerCase() %>.types';

const initialState: <%= Name %> = {};

export const <%= name.toLowerCase() %>Slice = createSlice({
  name: '<%= name.toLowerCase() %>',
  initialState,
  reducers: {
    set: (state, action: PayloadAction<<%= Name %>>) => {
      state = { ...action.payload };
    },
  },
});

export const <%= name.toLowerCase() %>Actions = <%= name.toLowerCase() %>Slice.actions;
