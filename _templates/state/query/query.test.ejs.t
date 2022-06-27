---
to: "<%= path ? `${path}/${name}/${name}.test.ts` : null %>"
---
import { storeSetup } from '@amnis/core/test/book.store';
import { api<%= Name %>Processes } from './<%= name %>.process';

const appStore = storeSetup();
const processes = api<%= Name %>Processes();

/**
 * ============================================================
 */
test('Handler should work.', () => {
  const output = processes.myendpoint({
    store: appStore,
    body: { data: null },
  });

  expect(output.json).toEqual({
    result: { data: null },
  });
});