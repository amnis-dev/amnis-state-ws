import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  entityCreate,
  entityUpdate,
} from '@amnis/core/entity';
import type {
  User,
  UserPayloadUpdate,
} from './user.types';

export const userInitialState: User = entityCreate({
  displayName: 'Unknown',
});

export const userSlice = createSlice({
  name: 'user',
  initialState: userInitialState,
  reducers: {
    set: (state, action: PayloadAction<UserPayloadUpdate>) => (
      { ...state, ...entityUpdate(state, action.payload) }
    ),
  },
});

export const userReducer = userSlice.reducer;

export const userActions = userSlice.actions;

export default userSlice;
