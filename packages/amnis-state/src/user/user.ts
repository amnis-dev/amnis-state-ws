import { createSlice } from '@reduxjs/toolkit';
import {
  entityCreate,
} from '@amnis/core/entity';
import type {
  User,
  UserActionCreate,
} from './user.types';

const initialState: User = entityCreate();

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    set: (state, action: UserActionCreate) => (entityCreate(action.payload)),
  },
});

export const userActions = userSlice.actions;
