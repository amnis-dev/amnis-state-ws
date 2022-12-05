import {
  Challenge,
  credentialKey,
  Entity,
  IoContext,
  IoOutput,
  ioOutput,
  logCreator,
  UID,
  Credential,
  base64Decode,
  CryptoAsymSignature,
  CryptoAsymPublicKey,
} from '@amnis/core';
import { challengeValidate } from './challenge.js';
import { findCredentialById, findUserByName } from './find.js';

const authenticateFailedOutput = (subtitle: string, description: string) => {
  const output = ioOutput();
  output.status = 401; // Unauthorized
  output.json.logs.push(logCreator({
    level: 'error',
    title: `Authentication Failed: ${subtitle}`,
    description,
  }));
  return output;
};

/**
 * Authenticates an account's credentials.
 */
export const authenticateAccount = async (
  context: IoContext,
  challenge: Challenge,
  username: string,
  credentialId: UID<Credential>,
  signatureEncoded: string,
): Promise<IoOutput> => {
  /**
   * Validate challenge.
   */
  const challangeValidation = challengeValidate(context, challenge);
  if (challangeValidation !== true) {
    return challangeValidation;
  }

  /**
   * Find the user
   */
  const user = await findUserByName(context, username);

  if (!user) {
    return authenticateFailedOutput(
      'User Not Found',
      `Could not find username "${user}".`,
    );
  }

  /**
   * Find the credentials on the user.
   */
  if (!user.$credentials.includes(credentialId)) {
    return authenticateFailedOutput(
      'Unlinked Credential',
      'The provided credential is not associated with this user.',
    );
  }

  /**
   * Find the credentials in the database.
   */
  const credential = await findCredentialById(context, credentialId);

  if (!credential) {
    return authenticateFailedOutput(
      'Missing Credential',
      'The provided credential could not be found.',
    );
  }

  /**
   * Validate the sigature with the credentials public key.
   */
  const signature = base64Decode(signatureEncoded).buffer;
  const publicKey = await context.crypto.keyImport(credential.publicKey);

  const verified = await context.crypto.asymVerify(
    username + credentialId + challenge,
    signature as CryptoAsymSignature,
    publicKey as CryptoAsymPublicKey,
  );

  if (!verified) {
    return authenticateFailedOutput(
      'Improper Attestation',
      'The provided credential could not be verified.',
    );
  }

  const output = ioOutput();
  output.status = 401;
  return output;
};

export default { authenticateAccount };
