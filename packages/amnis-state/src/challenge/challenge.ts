import {
  rtk,
  Challenge,
  challengeKey,
  challengeCreate,
  dateNumeric,
  UID,
  challengeBase,
} from '@amnis/core';
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
export const challengeAdapter = rtk.createEntityAdapter<Challenge>({
  /**
   * Identifiers are stored in the `$id` property.
   */
  selectId: (challenge) => challenge.$id,

  /**
   * OPTIONAL: Sort by value other than $id.
   */
  // sortComparer: (a, b) => a.name.localeCompare(b.name),
});

/**
 * Initialized challenge state with meta information.
 */
export const challengeInitialState = challengeAdapter.getInitialState<ChallengeMeta>({
  otps: [],
});

/**
 * RTK Challenge Slice
 */
export const challengeSlice = rtk.createSlice({
  name: challengeKey,
  initialState: challengeInitialState,
  reducers: {
    create: (state, action: PayloadAction<Partial<Challenge>>) => {
      challengeAdapter.addOne(state, challengeCreate(action.payload));
    },
    insert: (state, action: PayloadAction<Partial<Challenge> & { $id: Challenge['$id'] }>) => {
      challengeAdapter.addOne(
        state,
        {
          ...challengeBase(),
          ...action.payload,
          $id: action.payload.$id,
        },
      );
    },
    delete: (state, action: PayloadAction<UID>) => {
      challengeAdapter.removeOne(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    /**
     * Match any challenge action.
     */
    builder.addMatcher(isChallengeAction, (state) => {
      /**
       * Clean up any expired challenges.
       */
      const now = dateNumeric();
      const expiredIds = Object.values(state.entities)
        .filter((e) => e !== undefined && e.exp <= now)
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
};

/**
 * Challenge redux selector keys.
 */
export type ChallengeSelector = Extract<keyof typeof challengeSelectors, string>;

/**
 * Export the slice as default.
 */
export default challengeSlice;
