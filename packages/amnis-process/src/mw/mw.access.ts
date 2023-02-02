import {
  IoMiddleware,
  selectKey,
  JWTAccess,
  dateNumeric,
  UID,
} from '@amnis/core';
import { systemSelectors } from '@amnis/state';

/**
 * Ensures a JWT Access bearer is set.
 */
export const mwAccess: IoMiddleware = () => (next) => (context) => async (input, output) => {
  const { accessEncoded } = input;

  /**
   * Fetch the auth service public key from the store.
   */
  const publicKeyExport = selectKey(
    context.store.getState(),
    'core',
  );

  const publicKey = publicKeyExport ? await context.crypto.keyImport(publicKeyExport) : undefined;

  let access;

  if (accessEncoded) {
    access = await context.crypto.accessVerify(accessEncoded, publicKey);
  }

  /**
   * If the token could not be verified, provide anonymous access allowed by the system.
   */
  if (!access) {
    const system = systemSelectors.selectActive(context.store.getState());
    if (!system) {
      output.status = 503; // 503 Service Unavailable
      output.json.logs.push({
        level: 'error',
        title: 'Inactive System',
        description: 'There is no active system available to handle anonymous requests',
      });
      return output;
    }

    const accessAnon: JWTAccess = {
      iss: '',
      sub: 'user:anonymous' as UID,
      exp: dateNumeric(`${system.bearerExpires}`),
      typ: 'access',
    };
    access = accessAnon;
  }

  input.access = access;

  return next(context)(input, output);
};

export default { mwAccess };
