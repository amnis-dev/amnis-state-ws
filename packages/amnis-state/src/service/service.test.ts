import {
  serviceInitialState,
  serviceSelectors,
  serviceActions,
} from './service';
import { serviceDefault } from './service.default';

import { serviceStoreSetup } from './service.store';

/**
 * ============================================================
 */
test('service should return the initial state', () => {
  const store = serviceStoreSetup();

  expect(
    store.getState().service,
  ).toEqual(serviceInitialState);
});

/**
 * ============================================================
 */
test('should handle creating a new service', () => {
  const store = serviceStoreSetup();

  const action = serviceActions.create({ ...serviceDefault });

  store.dispatch(action);
  const entities = serviceSelectors.selectAll(store.getState());
  expect(entities).toHaveLength(1);

  expect(entities[0]).toEqual(expect.objectContaining({
    name: expect.any(String),
  }));
});
