import { configureStore } from '@reduxjs/toolkit';
import { reducer } from './reducer';

export const store = configureStore({
  reducer,
  // middleware: (getDefaultMiddleware) => {
  //   getDefaultMiddleware().concat(middleware);
  // },
});

export type RootState = ReturnType<typeof store.getState>;
