import {
  rtk,
  coreReducers,
  coreExtraReducers,
  Challenge,
  challengeKey,
  metaInitial,
  coreSelectors,
  Entity,
  dateNumeric,
  UID,
} from '@amnis/core';
import { apiExtraReducers } from '@amnis/api';
import type { Action, PayloadAction } from '@reduxjs/toolkit';
import type { ChallengeMeta } from './challenge.types.js';

/**
 * Matcher for any challenge action.
 */
function isChallengeAction(
  action: Action<string>,
): action is PayloadAction {
  return action.type.startsWith(challengeKey);
}

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
    /**
     * Match any challenge action.
     */
    builder.addMatcher(isChallengeAction, (state) => {
      /**
       * Clean up any expired challenges.
       */
      const now = dateNumeric();
      const expiredIds = Object.values(state.entities)
        .filter((e) => e !== undefined && e.expires <= now)
        .map((e) => e?.$id) as UID<Challenge>[];

      challengeAdapter.removeMany(state, expiredIds);
    });
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
