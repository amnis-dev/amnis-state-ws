---
to: "<%= path ? `${path}/${name}/${name}.test.ts` : null %>"
---
import { api<%= Name %>HandlersSetup } from './<%= name %>.handlers';

const handlers = api<%= Name %>HandlersSetup();

/**
 * ============================================================
 */
test('Handler should work.', () => {
  const response = handlers.myendpoint({ body: { data: null } });

  expect(response).toEqual({
    errors: [],
    result: {},
  });
});
