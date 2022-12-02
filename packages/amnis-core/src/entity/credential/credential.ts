import { uid } from '../../uid.js';
import type { Credential, CredentialBase, CredentialCreator } from './credential.types.js';

export const credentialKey = 'credential';

export const credentialBase: CredentialBase = {
  ip: '127.0.0.1',
  name: 'Unknown Credential',
  publicKey: '',
};

export const credentialCreator = (
  credential: CredentialCreator,
): Credential => ({
  ...credentialBase,
  ...credential,
  $id: uid(credentialKey),
});
