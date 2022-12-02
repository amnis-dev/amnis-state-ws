import { serviceBase, serviceCreator } from '@amnis/core';
import {
  serviceInitialState,
  serviceSelectors,
  serviceActions,
} from './service.js';

import { storeSetup } from '../store.js';

/**
 * ============================================================
 */
test('service should return the initial state', () => {
  const store = storeSetup();

  expect(
    store.getState().service,
  ).toEqual(serviceInitialState);
});

/**
 * ============================================================
 */
test('should handle creating a new service', () => {
  const store = storeSetup();

  const action = serviceActions.create(serviceCreator(serviceBase));

  store.dispatch(action);
  const entities = serviceSelectors.selectAll(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining({
    name: expect.any(String),
  }));
});
