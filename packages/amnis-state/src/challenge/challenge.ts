import {
  rtk,
  coreReducers,
  coreExtraReducers,
  Challenge,
  challengeKey,
  metaInitial,
  coreSelectors,
  Entity,
} from '@amnis/core';
import { apiExtraReducers } from '@amnis/api';
import type { ChallengeMeta } from './challenge.types.js';

/**
 * RTK challenge adapter.
 * Manages the normalized entities.
 */
export const challengeAdapter = rtk.createEntityAdapter<Entity<Challenge>>({
  /**
   * Identifiers are stored in the `$id` property.
   */
  selectId: (entity) => entity.$id,

  /**
   * TODO: A sort comparer other than `$id` is ideal.
   */
  // sortComparer: (a, b) => a.name.localeCompare(b.name),
});

/**
 * Initialized challenge state with meta information.
 */
export const challengeInitialState = challengeAdapter.getInitialState<ChallengeMeta>(
  metaInitial<Challenge>(),
);

/**
 * RTK Challenge Slice
 */
export const challengeSlice = rtk.createSlice({
  name: challengeKey,
  initialState: challengeInitialState,
  reducers: {
    /**
     * Common reducers and actions.
     */
    ...coreReducers<Challenge>(challengeKey, challengeAdapter),
  },
  extraReducers: (builder) => {
    /**
     * Required: Enables mutations from core actions.
     */
    coreExtraReducers(challengeKey, challengeAdapter, builder);
    /**
     * Required: Enables mutations from api requests.
     */
    apiExtraReducers(challengeKey, challengeAdapter, builder);
  },
});

/**
 * Challenge redux reducer.
 */
export const challengeReducer = challengeSlice.reducer;

/**
 * Challenge redux actions.
 */
export const challengeActions = challengeSlice.actions;

/**
 * Challenge redux selectors.
 */
export const challengeSelectors = {
  /**
   * Gets entity selectors.
   */
  ...challengeAdapter.getSelectors<{
    [challengeKey]: typeof challengeInitialState;
  }>((state) => state[challengeKey]),
  /**
   * Gets core selectors.
   */
  ...coreSelectors<Challenge>(challengeKey),
};

/**
 * Challenge redux selector keys.
 */
export type ChallengeSelector = Extract<keyof typeof challengeSelectors, string>;

/**
 * Export the slice as default.
 */
export default challengeSlice;
