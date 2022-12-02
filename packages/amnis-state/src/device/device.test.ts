import { deviceBase, deviceCreator } from '@amnis/core';
import {
  deviceInitialState,
  deviceSelectors,
  deviceActions,
} from './device.js';

import { storeSetup } from '../store.js';

/**
 * ============================================================
 */
test('device should return the initial state', () => {
  const store = storeSetup();

  expect(
    store.getState().device,
  ).toEqual(deviceInitialState);
});

/**
 * ============================================================
 */
test('should handle creating a new device', () => {
  const store = storeSetup();

  const action = deviceActions.create(deviceCreator(deviceBase));

  store.dispatch(action);
  const entities = deviceSelectors.selectAll(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining({
    name: expect.any(String),
  }));
});
