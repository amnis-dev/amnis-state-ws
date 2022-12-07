import type { Key } from './key.types.js';

export const keyKey = 'key';

export const keyBase = (): Key => ({
  id: 'unknown',
  name: 'Unknown Key',
  format: 'raw',
  wrapped: false,
  value: '',
});

export function keyCreate(
  key: Key,
): Key {
  return {
    ...keyBase(),
    ...key,
  };
}
