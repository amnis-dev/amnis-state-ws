import {
  AuthRegistration,
  Io,
  ioOutput,
  IoProcess,
  StateEntities,
  authRegistrationParse,
  logCreator,
  userKey,
  Entity,
  User,
} from '@amnis/core';
import { authenticateLogin } from '../utility/authenticate.js';
import { challengeCreate, challengeValidate } from '../utility/challenge.js';
import { registerAccount } from '../utility/register.js';
import { validate } from '../validate.js';

const process: IoProcess<
Io<AuthRegistration, StateEntities>
> = (context) => (
  async (input) => {
    const { crypto, validators } = context;
    const { body } = input;

    /**
     * When the body is undefined, output data necessary to begin the
     * registration ritual.
     */
    if (!body) {
      const output = await challengeCreate(context, input);
      return output;
    }

    /**
     * Must validate the registration input if it's defined.
     */
    const validateOutput = validate(validators.AuthRegistration, body);
    if (validateOutput) {
      return validateOutput;
    }

    const authRegistrationParsed = await authRegistrationParse(body);

    /**
     * Ensure the auth registration parsing was successfull.
     */
    if (!authRegistrationParsed) {
      const output = ioOutput();
      output.status = 500; // Internal Server Error
      output.json.logs = [logCreator({
        level: 'error',
        title: 'Invalid Encoding',
        description: 'Registration parameters could not be decoded.',
      })];
      return output;
    }

    const { challenge, credential, signature } = authRegistrationParsed;

    /**
     * Verify that the challenge code is valid.
     */
    const challangeValidation = challengeValidate(context, challenge);
    if (challangeValidation !== true) {
      return challangeValidation;
    }

    /**
     * Import the public key from the credential.
     */
    const publicKey = await crypto.keyImport(credential.publicKey);
    if (!publicKey) {
      const output = ioOutput();
      output.status = 500; // Internal Server Error
      output.json.logs = [logCreator({
        level: 'error',
        title: 'Public Key Not Found',
        description: 'Could not retrieve the public key from the request.',
      })];
      return output;
    }

    /**
     * Verify the signature
     */
    const signatureValid = await crypto.asymVerify(
      body.credential,
      signature,
      publicKey,
    );

    if (signatureValid !== true) {
      const output = ioOutput();
      output.status = 500; // Internal Server Error
      output.json.logs = [logCreator({
        level: 'error',
        title: 'Unrecognized Signature',
        description: 'Could not verify the requesting signature against the credential.',
      })];
      return output;
    }

    const outputRegistration = await registerAccount(
      context,
      authRegistrationParsed,
      input.ip,
    );

    if (outputRegistration.status !== 200) {
      return outputRegistration;
    }

    const user = outputRegistration.json.result?.[userKey]?.[0] as Entity<User>;

    if (!user) {
      const output = ioOutput();
      output.status = 500; // Internal Server Error
      output.json.logs = [logCreator({
        level: 'error',
        title: 'User Not Registered',
        description: 'There was an issue when registering your user account.',
      })];
      return output;
    }

    /**
     * With a successful registration, we can login the user with the
     * register account.
     */
    const outputLogin = await authenticateLogin(context, user);

    outputLogin.json.logs = [...outputRegistration.json.logs, ...outputLogin.json.logs];

    return outputLogin;
  }
);

export const authProcessRegister = process;

export default { authProcessRegister };
