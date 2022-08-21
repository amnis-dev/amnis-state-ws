import { storeSetup } from './env.node/store';
import { contextCreate } from './env.node/context';

test('should return state', async () => {
  const store = storeSetup();

  expect(store.getState()).toEqual(store.getState());
});

test('should create initial context', async () => {
  const context = await contextCreate();

  expect(context.store.getState()).toBeDefined();
});
