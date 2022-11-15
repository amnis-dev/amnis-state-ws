import { Entity, entityCreate } from '../entity/index.js';
import type { Encryption, EncryptionBase, EncryptionBaseCreate } from './encryption.types.js';

export const encryptionKey = 'encryption';

export const encryptionBase: EncryptionBase = {
  name: 'Unknown Key',
  tag: 'unknown',
  type: 'rsa',
  value: '',
};

export function encryptionCreate(
  encryption: EncryptionBaseCreate,
  entity: Partial<Entity> = {},
): Encryption {
  const cryptoEntity = entityCreate<Encryption>(encryptionKey, {
    ...encryptionBase,
    ...encryption,
  }, entity);

  return cryptoEntity;
}
