/* eslint-disable @typescript-eslint/no-explicit-any */
import * as toolkitRaw from '@reduxjs/toolkit';

const rtk = ((toolkitRaw as any).default ?? toolkitRaw) as typeof toolkitRaw;

export const {
  createAction,
  createSlice,
  configureStore,
  createEntityAdapter,
  isRejectedWithValue,
  isFulfilled,
  combineReducers,
  isAnyOf,
  nanoid,
} = rtk;

export default rtk;
