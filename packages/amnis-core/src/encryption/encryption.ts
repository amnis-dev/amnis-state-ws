import { uid } from '../uid.js';
import { EntityCreator } from '../entity/index.js';
import type { Encryption, EncryptionBase, EncryptionBaseCreate } from './encryption.types.js';

export const encryptionKey = 'encryption';

export const encryptionBase: EncryptionBase = {
  name: 'Unknown Key',
  tag: 'unknown',
  type: 'asym',
  value: '',
};

export function encryptionCreator(
  encryption: EncryptionBaseCreate,
): EntityCreator<Encryption> {
  return {
    ...encryptionBase,
    ...encryption,
    $id: uid(encryptionKey),
  };
}
