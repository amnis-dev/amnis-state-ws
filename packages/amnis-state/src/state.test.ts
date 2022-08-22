import { storeSetup } from './env.node/store';

test('should return state', async () => {
  const store = storeSetup();

  expect(store.getState()).toEqual(store.getState());
});
