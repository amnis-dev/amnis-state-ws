/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { ActionReducerMapBuilder, EntityAdapter } from '@reduxjs/toolkit';
import type { Entity, MetaState } from '@amnis/core/index';
import { apiCrud } from './crud';

export function apiExtraReducers<E extends Entity>(
  key: string,
  adapter: EntityAdapter<E>,
  builder: ActionReducerMapBuilder<MetaState<E>>,
) {
  /**
   * Matches when a creation method is fulfilled.
   */
  builder.addMatcher(apiCrud.endpoints.create.matchFulfilled, (state, action) => {
    const { payload } = action;
    if (Array.isArray(payload[key])) {
      /** @ts-ignore */
      adapter.upsertMany<MetaState<E>>(state, payload[key]);
    }
  });
}

export default { apiExtraReducers };
