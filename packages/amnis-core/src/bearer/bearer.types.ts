/* eslint-disable no-shadow */
import { CryptoToken } from '../crypto.types.js';
import type { DateNumeric } from '../types.js';

/**
 * An interface for a bearer.
 */
export interface Bearer {
  /**
   * Bearer identifier.
   */
  id: string;

  /**
   * Expiration date.
   */
  exp: DateNumeric;

  /**
   * Encoded access token.
   */
  access: CryptoToken;
}
