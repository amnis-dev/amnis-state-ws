/* eslint-disable no-bitwise */
import type {
  Bearer,
} from './bearer.types.js';

export const bearerKey = 'bearer';

export function bearerCreate(
  bearer: Bearer,
): Bearer {
  const bearerNew: Bearer = {
    ...bearer,
  };

  return bearerNew;
}
