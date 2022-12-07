import {
  Challenge,
  IoContext,
  IoOutput,
  ioOutput,
  logCreator,
  UID,
  Credential,
  base64Decode,
  User,
  StateEntities,
  Entity,
  entityCreate,
  userKey,
  profileKey,
  contactKey,
  sessionKey,
} from '@amnis/core';
import { systemSelectors } from '@amnis/state';
import { challengeValidate } from './challenge.js';
import {
  findContactById, findCredentialById, findProfileByUserId, findUserByName,
} from './find.js';
import { generateBearer, generateSession } from './generate.js';

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

const authenticateLoginFailedOutput = (title: string, description: string) => {
  const output = ioOutput();
  output.status = 500; // Unauthorized
  output.json.logs.push(logCreator({
    level: 'error',
    title,
    description,
  }));
  return output;
};

/**
 * Login a user with a username without validation.
 * Use authenticateAccount to authenticate securely.
 */
export const authenticateLogin = async (
  context: IoContext,
  user: Entity<User>,
): Promise<IoOutput<StateEntities>> => {
  const profile = await findProfileByUserId(context, user.$id);

  if (!profile) {
    return authenticateLoginFailedOutput(
      'No Profile',
      'No profile information was found with the provided user account.',
    );
  }

  if (!profile.$contact) {
    return authenticateLoginFailedOutput(
      'No Contact Relation',
      'There is no contact information associated with the provided user account\'s profile.',
    );
  }

  const contact = await findContactById(context, profile.$contact);

  if (!contact) {
    return authenticateLoginFailedOutput(
      'No Contact',
      'No contact information was found with the provided user account\'s profile.',
    );
  }

  /**
   * Get the active system.
   */
  const system = systemSelectors.selectActive(context.store.getState());

  if (!system) {
    const output = ioOutput();
    output.status = 500;
    output.json.logs.push(logCreator({
      level: 'error',
      title: 'Inactive System',
      description: 'There is no active system available to complete the login.',
    }));
    return output;
  }

  /**
   * Create the authenticated user's session.
   */
  const sessionBase = await generateSession(system, user, profile);
  const session = entityCreate(sessionBase, { $owner: user.$id });
  const sessionEncrypted = await context.crypto.sessionEncrypt(sessionBase);

  /**
   * Create the authenticated user's access bearer token.
   */
  const bearerAccess = await generateBearer(context, system, user);

  const stateEntities: StateEntities = {
    [userKey]: [user],
    [profileKey]: [profile],
    [contactKey]: [contact],
    [sessionKey]: [session],
  };

  const output = ioOutput();
  output.json.result = stateEntities;
  output.cookies.authSession = sessionEncrypted;
  output.json.bearers = [bearerAccess];

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
    signature,
    publicKey,
  );

  if (!verified) {
    return authenticateFailedOutput(
      'Improper Attestation',
      'The provided credential could not be verified.',
    );
  }

  /**
   * All authentication checks can been completed.
   */
  const output = await authenticateLogin(context, user);

  return output;
};
