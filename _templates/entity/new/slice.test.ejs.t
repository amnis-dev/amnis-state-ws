---
to: <%= `packages/amnis-state/src/${name}/${name}.test.ts` %>
---
import {
  <%= name %>InitialState,
  <%= name %>Reducer,
  <%= name %>Actions,
} from './<%= name %>';
import type {
  <%= Name %>PayloadCreate,
} from './<%= name %>.types';

test('should return the initial state', () => {
  expect(
    <%= name %>Reducer(undefined, { type: '', payload: {} }),
  ).toEqual(<%= name %>InitialState);
});

test('should handle <%= name %> properties being set to other values', () => {
  const payload: <%= Name %>PayloadCreate = {};
  expect(
    <%= name %>Reducer(<%= name %>InitialState, <%= name %>Actions.set(payload)),
  ).toEqual({
    ...<%= name %>InitialState,
    ...payload,
  });
});
