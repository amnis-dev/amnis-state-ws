import { storeSetup } from './store.js';
import { slices } from './slices.js';

test('should setup store with all reducers and state', () => {
  const store = storeSetup();

  const state = store.getState();

  /**
   * All state keys should exist.
   */
  expect(Object.keys(state)).toEqual(Object.keys(slices));

  /**
   * Inital state should match initial states.
   */
  Object.keys(slices).forEach((key) => {
    const sliceKey = key as keyof typeof slices;
    expect(state[sliceKey]).toMatchObject(slices[sliceKey].getInitialState());
  });
});
