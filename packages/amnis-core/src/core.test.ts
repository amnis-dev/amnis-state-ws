import type { Grant } from './types';
import {
  grantStringify, grantParse, task,
} from './grant';

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
