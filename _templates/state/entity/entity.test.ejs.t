---
to: "<%= path ? `${path}/${name}/${name}.test.ts` : null %>"
---
import {
  <%= name %>InitialState,
  <%= name %>Actions,
  <%= name %>Selectors,
} from './<%= name %>';
import type {
  <%= Name %>,
} from './<%= name %>.types';

import { storeSetup } from './<%= name %>.store';

/**
 * ============================================================
 */
test('<%= name %> should return the initial state', () => {
  const store = storeSetup();

  expect(
    store.getState()['@amnis/<%= name %>'],
  ).toEqual(<%= name %>InitialState);
});

/**
 * ============================================================
 */
test('should handle the creation of a new <%= name %>', () => {
  const store = storeSetup();

  const payload: EntityCreate<<%= Name %>> = {};

  store.dispatch(<%= name %>Actions.create(payload));

  const entities = <%= name %>Selectors.selectAll(store.getState());

  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining({
    id: expect.any(String),
  }));
});

/**
 * ============================================================
 */
test('should handle setting active entity', () => {
  const store = storeSetup();

  const payload: EntityCreate<<%= Name %>> = {};

  store.dispatch(<%= name %>Actions.create(payload));

  const entities = <%= name %>Selectors.selectAll(store.getState());

  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining({
    id: expect.any(String),
  }));
});
