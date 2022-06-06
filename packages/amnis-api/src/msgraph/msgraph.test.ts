import { storeSetup } from '@amnis/core/test/book.store';
import { apiMSGraphProcesses } from './msgraph.process';

const appStore = storeSetup();
const processes = apiMSGraphProcesses();

/**
 * ============================================================
 */
test('Handler should work.', () => {
  const output = processes.myendpoint({
    store: appStore,
    body: { data: null },
  });

  expect(output.json).toEqual({
    errors: [],
    result: { data: null },
  });
});
