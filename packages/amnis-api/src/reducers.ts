/* eslint-disable @typescript-eslint/ban-ts-comment */
import type {
  ActionReducerMapBuilder,
  EntityAdapter,
} from '@reduxjs/toolkit';
import {
  rtk,
  Entity,
  IoOutput,
  LogCreator,
  logCreator,
  logKey,
  MetaState,
  profileKey,
  sessionKey,
  UID,
  userKey,
  entityCreate,
  contactKey,
  EntityCreator,
  credentialKey,
} from '@amnis/core';
import { apiAuth } from './auth/index.js';
import { apiCrud } from './crud/index.js';

export function apiExtraReducers<C extends EntityCreator>(
  key: string,
  adapter: EntityAdapter<Entity<C>>,
  builder: ActionReducerMapBuilder<MetaState<C>>,
) {
  /**
   * ================================================================================
   * Matches ANY fulfillment.
   * ------------------------------------------------------------
   */
  builder.addMatcher(rtk.isFulfilled, (state, action) => {
    const payload = action.payload as IoOutput['json'];
    const logs = payload.logs as LogCreator[];

    /**
     * StateCreator log entities from the fulfillment.
     */
    if (key === logKey && logs?.length > 0) {
      const logEntities = logs.map((logBase) => entityCreate(logCreator(logBase)));
      /** @ts-ignore */
      adapter.addMany(state, logEntities);
    }
  });

  /**
   * ================================================================================
   * Matches ANY rejection that has a payload.
   * ------------------------------------------------------------
   */
  builder.addMatcher(rtk.isRejectedWithValue, (state, action) => {
    const payload = action.payload as { data: IoOutput['json'] } | undefined;

    if (!payload) {
      return;
    }

    /**
     * StateCreator log entities from the fulfillment.
     */
    if (key === logKey && payload?.data?.logs?.length > 0) {
      const logs = payload.data.logs as LogCreator[];
      const logEntities = logs.map((logBase) => entityCreate(logCreator(logBase)));
      /** @ts-ignore */
      adapter.addMany(state, logEntities);
    }
  });

  /**
   * ================================================================================
   * Auth Login
   * Matches when a login request is fulfilled.
   * ------------------------------------------------------------
   */
  builder.addMatcher(apiAuth.endpoints.login.matchFulfilled, (state, action) => {
    const { payload } = action;
    const { result } = payload;
    if (result && result[key] && Array.isArray(result[key])) {
      /** @ts-ignore */
      adapter.upsertMany<MetaState<E>>(state, result[key]);
      /**
       * Set the active session/user.
       */
      if (
        [
          userKey,
          credentialKey,
          sessionKey,
          profileKey,
          contactKey,
        ].includes(key) && !!result[key].length
      ) {
        state.active = result[key][0].$id;
      }
    }
  });

  /**
   * ================================================================================
   * Auth Register
   * Matches when a register request is fulfilled.
   * ------------------------------------------------------------
   */
  builder.addMatcher(apiAuth.endpoints.register.matchFulfilled, (state, action) => {
    const { payload } = action;
    const { result } = payload;
    if (result && result[key] && Array.isArray(result[key])) {
      /** @ts-ignore */
      adapter.upsertMany<MetaState<E>>(state, result[key]);
      /**
       * Set the active session/user.
       */
      if (
        [
          userKey,
          credentialKey,
          sessionKey,
          profileKey,
          contactKey,
        ].includes(key) && !!result[key].length
      ) {
        state.active = result[key][0].$id;
      }
    }
  });

  /**
   * ================================================================================
   * Auth Logout
   * Matches when a logout request is fulfilled.
   * ------------------------------------------------------------
   */
  builder.addMatcher(apiAuth.endpoints.logout.matchFulfilled, (state, action) => {
    const { payload } = action;
    const { result } = payload;
    if (result && result[key] && Array.isArray(result[key])) {
      /** @ts-ignore */
      adapter.removeMany<MetaState<E>>(state, result[key]);
    }

    /**
     * De-activates login entities.
     */
    if (
      [
        userKey,
        sessionKey,
        profileKey,
        contactKey,
      ].includes(key)
    ) {
      state.active = null;
    }
  });

  /**
   * ================================================================================
   * Auth Create
   * Matches when a auth create account request is fulfilled.
   */
  builder.addMatcher(apiAuth.endpoints.create.matchFulfilled, (state, action) => {
    const { payload } = action;
    const { result } = payload;
    if (result && result[key] && Array.isArray(result[key])) {
      /** @ts-ignore */
      adapter.upsertMany<MetaState<E>>(state, result[key]);
    }
  });

  /**
   * ================================================================================
   * Auth PKCE
   * Matches when a PKCE login request is fulfilled.
   * ------------------------------------------------------------
   */
  builder.addMatcher(apiAuth.endpoints.pkce.matchFulfilled, (state, action) => {
    const { payload } = action;
    const { result } = payload;
    if (result && result[key] && Array.isArray(result[key])) {
      /** @ts-ignore */
      adapter.upsertMany<MetaState<E>>(state, result[key]);
      /**
       * Set the active session/user.
       */
      if ([userKey, sessionKey, profileKey].includes(key) && !!result[key].length) {
        state.active = result[key][0].$id;
      }
    }
  });

  /**
   * ================================================================================
   * CRUD Create
   * Matches when a creation method is fulfilled.
   * ------------------------------------------------------------
   */
  builder.addMatcher(apiCrud.endpoints.create.matchFulfilled, (state, action) => {
    const { payload } = action;
    const { result } = payload;
    if (result && result[key] && Array.isArray(result[key])) {
      /** @ts-ignore */
      adapter.upsertMany<MetaState<E>>(state, result[key]);
    }
  });

  /**
   * ================================================================================
   * CRUD Read
   * Matches when a CRUD read method is fulfilled.
   */
  builder.addMatcher(apiCrud.endpoints.read.matchFulfilled, (state, action) => {
    const { payload } = action;
    const { result } = payload;
    if (result && result[key] && Array.isArray(result[key])) {
      /** @ts-ignore */
      adapter.upsertMany<MetaState<E>>(state, result[key]);
    }
  });

  /**
   * ================================================================================
   * CRUD Update
   * Matches when a CRUD update method is fulfilled.
   * ------------------------------------------------------------
   */
  builder.addMatcher(apiCrud.endpoints.update.matchFulfilled, (state, action) => {
    const { payload } = action;
    const { result } = payload;
    if (result && result[key] && Array.isArray(result[key])) {
      /** @ts-ignore */
      adapter.upsertMany<MetaState<E>>(state, result[key]);

      /**
       * Clear comparison data since the results are fresh from the service.
       */
      result[key].forEach((entity) => {
        // Clean up data.
        if (state.original[entity.$id]) {
          delete state.original[entity.$id];
        }
        if (state.differences[entity.$id]) {
          delete state.differences[entity.$id];
        }
      });
    }
  });

  /**
   * ================================================================================
   * CRUD Delete
   * Matches when a CRUD delete method is fulfilled.
   * ------------------------------------------------------------
   */
  builder.addMatcher(apiCrud.endpoints.delete.matchFulfilled, (state, action) => {
    const { payload } = action;
    const { result } = payload;
    if (result && result[key] && Array.isArray(result[key])) {
      /** @ts-ignore */
      adapter.removeMany<MetaState<E>>(state, result[key]);

      if (state.active && result[key].includes(state.active)) {
        state.active = null;
      }

      if (state.focused && result[key].includes(state.focused)) {
        state.focused = null;
      }

      if (
        state.selection.length > 0
        && result[key].some((id: UID) => state.selection.includes(id))
      ) {
        state.selection = state.selection.filter((selectionId: UID) => (
          result[key].includes(selectionId)
        ));
      }
    }
  });
}

export default { apiExtraReducers };
