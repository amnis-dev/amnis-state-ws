/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  ActionReducerMapBuilder,
  EntityAdapter,
  isRejectedWithValue,
  isFulfilled,
} from '@reduxjs/toolkit';
import type { Entity, MetaState } from '@amnis/core/entity';
import { userKey } from '@amnis/core/user';
import { sessionKey } from '@amnis/core/session';
import { profileKey } from '@amnis/core/profile';
import { LogBaseCreate, logCreate, logKey } from '@amnis/core/log';
import type { Reference } from '@amnis/core/types';
import { apiAuth } from './auth/auth.api.browser';
import { apiCrud } from './crud/crud.api.browser';
import type { ApiOutput } from './types';

export function apiExtraReducers<E extends Entity>(
  key: string,
  adapter: EntityAdapter<E>,
  builder: ActionReducerMapBuilder<MetaState<E>>,
) {
  /**
   * ================================================================================
   * Matches ANY fulfillment.
   * ------------------------------------------------------------
   */
  builder.addMatcher(isFulfilled, (state, action) => {
    const payload = action.payload as ApiOutput['json'];
    const logs = payload.logs as LogBaseCreate[];

    /**
     * StateCreate log entities from the fulfillment.
     */
    if (key === logKey && logs?.length > 0) {
      const logEntities = logs.map((logBase) => logCreate(logBase));
      /** @ts-ignore */
      adapter.addMany(state, logEntities);
    }
  });

  /**
   * ================================================================================
   * Matches ANY rejection that has a payload.
   * ------------------------------------------------------------
   */
  builder.addMatcher(isRejectedWithValue, (state, action) => {
    const payload = action.payload as { data: ApiOutput['json'] } | undefined;

    if (!payload) {
      return;
    }

    /**
     * StateCreate log entities from the fulfillment.
     */
    if (key === logKey && payload?.data?.logs?.length > 0) {
      const logs = payload.data.logs as LogBaseCreate[];
      const logEntities = logs.map((logBase) => logCreate(logBase));
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
      if ([userKey, sessionKey, profileKey].includes(key) && !!result[key].length) {
        state.active = result[key][0].$id;
      }
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
   * Auth Renew
   * Matches when a renew request is fulfilled.
   * ------------------------------------------------------------
   */
  builder.addMatcher(apiAuth.endpoints.renew.matchFulfilled, (state, action) => {
    const { payload } = action;
    const { result } = payload;
    if (result && result[key] && Array.isArray(result[key])) {
      /** @ts-ignore */
      adapter.upsertMany<MetaState<E>>(state, result[key]);

      /**
       * Set the new active session.
       */
      if (key === sessionKey && !!result[key].length) {
        const sessionIdPrev = state.active;
        state.active = result[key][0].$id;

        /**
         * StateDelete the previously active session if it existed.
         */
        if (sessionIdPrev) {
          /** @ts-ignore */
          adapter.removeOne(state, sessionIdPrev);
        }
      }

      /**
       * Set the active user/profile.
       */
      if ([userKey, profileKey].includes(key) && !!result[key].length) {
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
        && result[key].some((id: Reference) => state.selection.includes(id))
      ) {
        state.selection = state.selection.filter((selectionId) => (
          result[key].includes(selectionId)
        ));
      }
    }
  });
}

export default { apiExtraReducers };
