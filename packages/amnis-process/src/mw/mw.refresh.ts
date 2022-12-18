import {
  dateNumeric,
  IoMiddleware, JWTAccess, selectKey,
} from '@amnis/core';
import { systemSelectors } from '@amnis/state';
import { generateBearer, generateSession } from '../utility/generate.js';

/**
 * Will refresh access if a valid session is set.
 */
export const mwRefresh: IoMiddleware = () => (next) => (context) => async (input, output) => {
  const { sessionEncryption, accessEncoded } = input;

  /**
   * If a session is not established or a access token is not provided,
   * continue without refreshing.
   */
  if (!sessionEncryption || !accessEncoded) {
    return next(context)(input, output);
  }

  /**
   * Decrypt the session.
   * NOTE: An expired session will not decrypt when using sessionDecrypt.
   */
  const session = await context.crypto.sessionDecrypt(sessionEncryption);

  if (!session) {
    return next(context)(input, output);
  }

  /**
   * Decode the access.
   */
  const [
    accessDecoded,
    accessRaw,
    accessSigature,
  ] = await context.crypto.tokenDecode<JWTAccess>(accessEncoded);

  /**
   * Continue if no valid access was provided.
   */
  if (!accessDecoded || !accessRaw || !accessSigature) {
    return next(context)(input, output);
  }

  /**
   * Ensure that was token was signed by the auth processors.
   * Doesn't matter if it's expired, only that it was signed.
   */
  const publicKeyExport = selectKey(
    context.store.getState(),
    'core',
  );
  const publicKey = publicKeyExport ? await context.crypto.keyImport(publicKeyExport) : undefined;
  const accessVerified = await context.crypto.asymVerify(accessRaw, accessSigature, publicKey);

  /**
   * If it's not verified, continue without refreshing.
   */
  if (!accessVerified) {
    return next(context)(input, output);
  }

  /**
   * Get the active system.
   */
  const system = systemSelectors.selectActive(context.store.getState());

  if (!system) {
    output.status = 503; // 503 Service Unavailable
    output.json.logs.push({
      level: 'error',
      title: 'Inactive System',
      description: 'There is no active system available to refresh access.',
    });
    return output;
  }

  /**
   * Everything checks out, refresh the access token and session.
   */
  const sessionNew = await generateSession(system, session.$subject, '');
  const sessionEncrypted = await context.crypto.sessionEncrypt(sessionNew);
  output.cookies.authSession = sessionEncrypted;

  /**
   * Only provide a new token if it has already expired.
   */
  if ((accessDecoded.exp * 1000) <= dateNumeric()) {
    const bearerNew = await generateBearer(context, system, session.$subject, accessDecoded.roles);
    output.json.bearers = [bearerNew];
  }

  return next(context)(input, output);
};

export default { mwRefresh };
