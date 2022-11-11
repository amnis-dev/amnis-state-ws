import type { Middleware, Reducer, Slice } from '@reduxjs/toolkit';
import { slices } from './slices.js';

type ReducerMap<S> = {
  [N in keyof S]: S[N] extends Slice ? S[N]['reducer'] : never;
}

const reducers = Object.keys(slices).reduce((obj, key) => {
  const sliceKey = key as keyof typeof slices;
  obj[sliceKey] = slices[sliceKey].reducer;
  return obj;
}, {} as Record<string, Reducer>) as ReducerMap<typeof slices>;

const middleware: Middleware[] = [];

export const stateSet = {
  reducers,
  middleware,
};

export default stateSet;
