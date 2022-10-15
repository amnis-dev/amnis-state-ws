import { storeSetup } from './env.node/store.js';

test('should return state', async () => {
  const store = storeSetup();

  expect(store.getState()).toEqual(store.getState());
});
