import type { Grant } from './grant/grant.types.js';
import {
  grantStringify, grantParse, task,
} from './grant/grant.js';

const grant: Grant = {
  key: 'key',
  scope: 'global',
  task: task(1, 1, 1, 1),
};

/**
 * ============================================================
 */
test('grant should stringify', () => {
  const grantString = grantStringify(grant);

  expect(grantString).toEqual('key:global:15');
});

/**
 * ============================================================
 */
test('grant should parse from string', () => {
  const grantParsed = grantParse('key:global:15');

  expect(grantParsed).toEqual(grant);
});
