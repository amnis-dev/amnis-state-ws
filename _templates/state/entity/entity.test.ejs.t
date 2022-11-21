---
to: "<%= path ? `${path}/${name}/${name}.test.ts` : null %>"
---
import { <%= name %>Base } from '@amnis/core';
import {
  <%= name %>InitialState,
  <%= name %>Selectors,
  <%= name %>Actions,
} from './<%= name %>.js';

import { storeSetup } from '../store.js';

/**
 * ============================================================
 */
test('<%= name %> should return the initial state', () => {
  const store = storeSetup();

  expect(
    store.getState().<%= name %>,
  ).toEqual(<%= name %>InitialState);
});

/**
 * ============================================================
 */
test('should handle creating a new <%= name %>', () => {
  const store = storeSetup();

  const action = <%= name %>Actions.create({ ...<%= name %>Base });

  store.dispatch(action);
  const entities = <%= name %>Selectors.selectAll(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining({
    name: expect.any(String),
  }));
});
