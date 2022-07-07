---
to: "<%= path ? `${path}/${name}/${name}.test.ts` : null %>"
---
import { <%= name %>Key, <%= name %>Create } from './<%= name %>';

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
  const <%= name %> = <%= name %>Create({
    prop: null,
  });

  expect(<%= name %>).toEqual(
    expect.objectContaining({
      prop: null,
    }),
  );
});
