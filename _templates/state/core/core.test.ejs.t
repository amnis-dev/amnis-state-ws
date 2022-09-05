---
to: "<%= path ? `${path}/${name}/${name}.test.ts` : null %>"
---
import { <%= name %>Key, <%= name %>Create, <%= name %>Base } from './<%= name %>';

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
  const <%= name %> = <%= name %>Create(<%= name %>Base);

  expect(<%= name %>).toEqual(
    expect.objectContaining(<%= name %>Base),
  );
});
