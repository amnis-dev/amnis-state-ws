import {
  rtk,
  coreReducers,
  coreExtraReducers,
  Session,
  sessionKey,
  metaInitial,
  coreSelectors,
} from '@amnis/core';
import { apiExtraReducers, apiAuth } from '@amnis/api';
import type {
  SessionMeta,
} from './session.types.js';

/**
 * RTK session adapter.
 * Manages the normalized entities.
 */
export const sessionAdapter = rtk.createEntityAdapter<Session>({
  /**
   * Identifiers are stored in the `$id` property.
   */
  selectId: (entity) => entity.$id,

  /**
   * Sort by the session holder's name.
   */
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

/**
 * Initialized session state with meta information.
 */
export const sessionInitialState = sessionAdapter.getInitialState<SessionMeta>(
  metaInitial<Session>(),
);

/**
 * RTK Session Slice
 */
export const sessionSlice = rtk.createSlice({
  name: sessionKey,
  initialState: sessionInitialState,
  reducers: {
    /**
     * Common reducers and actions.
     */
    ...coreReducers<Session>(sessionKey, sessionAdapter),
  },
  extraReducers: (builder) => {
    /**
     * Required: Enables mutations from core actions.
     */
    coreExtraReducers(sessionKey, sessionAdapter, builder);

    /**
     * Required: Enables mutations from api requests.
     */
    apiExtraReducers(sessionKey, sessionAdapter, builder);

    /**
     * Delete the active session on a logout response.
     * Fulfilment or rejection, the client data is still cleared.
     */
    builder.addMatcher(rtk.isAnyOf(
      apiAuth.endpoints.logout.matchFulfilled,
      apiAuth.endpoints.logout.matchRejected,
    ), (state) => {
      const activeId = state.active;
      if (!activeId) {
        return;
      }

      sessionAdapter.removeOne(state, activeId);
    });
  },
});

/**
 * Session redux reducer.
 */
export const sessionReducer = sessionSlice.reducer;

/**
 * Session redux actions.
 */
export const sessionActions = sessionSlice.actions;

/**
 * Session redux selectors.
 */
export const sessionSelectors = {
  /**
   * Gets entity selectors.
   */
  ...sessionAdapter.getSelectors<{
    [sessionKey]: typeof sessionInitialState;
  }>((state) => state[sessionKey]),
  /**
   * Gets core selectors.
   */
  ...coreSelectors<Session>(sessionKey),
};

/**
 * Session redux selector keys.
 */
export type SessionSelector = Extract<keyof typeof sessionSelectors, string>;

/**
 * Export the slice as default.
 */
export default sessionSlice;
