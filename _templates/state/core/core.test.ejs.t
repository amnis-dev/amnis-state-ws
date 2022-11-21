---
to: "<%= path ? `${path}/${name}/${name}.test.ts` : null %>"
---
import { <%= name %>Key, <%= name %>Creator, <%= name %>Base } from './<%= name %>.js';

/**
 * ============================================================
 */
test('<%= name %> key should be is properly set', () => {
  expect(<%= name %>Key).toEqual('<%= name %>');
});

/**
 * ============================================================
 */
test('should create a <%= name %>', () => {
  const <%= name %> = <%= name %>Creator(<%= name %>Base);

  expect(<%= name %>).toEqual(
    expect.objectContaining(<%= name %>Base),
  );
});
