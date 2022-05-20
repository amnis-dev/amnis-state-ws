import { configureStore } from '@reduxjs/toolkit';
import { reducerMap } from './reducer';
import { middleware } from './middleware';

export const store = configureStore({
  reducer: reducerMap,
  middleware: (getDefaultMiddleware) => (
    getDefaultMiddleware().concat(middleware)
  ),
});

export type RootState = ReturnType<typeof store.getState>;
