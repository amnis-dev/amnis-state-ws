import { Entity, entityCreate } from '../entity/index.js';
import type { Crypto, CryptoBase, CryptoBaseCreate } from './crypto.types.js';

export const cryptoKey = 'crypto';

export const cryptoBase: CryptoBase = {
  name: 'Unknown Key',
  tag: 'unknown',
  type: 'rsa',
  pair: 'public',
  value: '',
};

export function cryptoCreate(
  crypto: CryptoBaseCreate,
  entity: Partial<Entity> = {},
): Crypto {
  const cryptoEntity = entityCreate<Crypto>(cryptoKey, {
    ...cryptoBase,
    ...crypto,
  }, entity);

  return cryptoEntity;
}
