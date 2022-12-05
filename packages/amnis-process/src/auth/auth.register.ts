import {
  AuthRegistration,
  challengeCreator,
  challengeKey,
  dateNumeric,
  entityCreate,
  Io,
  ioOutput,
  IoProcess,
  StateEntities,
  authRegistrationParse,
  logCreator,
  CryptoAsymPublicKey,
} from '@amnis/core';
import { challengeActions, systemSelectors } from '@amnis/state';
import { challengeValidate } from '../utility/challenge.js';
import { registerAccount } from '../utility/register.js';
import { validate } from '../validate.js';

const process: IoProcess<
Io<AuthRegistration, StateEntities>
> = (context) => (
  async (input) => {
    const { store, crypto, validators } = context;
    const { body, access } = input;

    /**
     * When the body is undefined, output data necessary to begin the
     * registration ritual.
     */
    if (!body) {
      const system = systemSelectors.selectActive(store.getState());

      if (!system) {
        const output = ioOutput();
        output.status = 500;
        output.json.logs.push(logCreator({
          level: 'error',
          title: 'Inactive System',
          description: 'There is no active system available to initalize the registration.',
        }));
        return output;
      }

      if (system.registrationOpen !== true) {
        const isAdmin = access?.roles.includes(system.$adminRole);
        const isExec = access?.roles.includes(system.$execRole);

        if (!isAdmin && !isExec) {
          const output = ioOutput();
          output.status = 500;
          output.json.logs.push(logCreator({
            level: 'error',
            title: 'Registration Closed',
            description: 'The system has disabled registration.',
          }));
          return output;
        }
      }

      const outputStart = ioOutput();

      /**
       * Create the challenge string.
       */
      const challangeValue = await crypto.randomString(32);

      /**
       * Generate the unique challange code to send back.
       */
      const challengeEntity = entityCreate(
        challengeCreator({
          value: challangeValue,
          expires: dateNumeric(`${system.registrationExpiration}m`),
        }),
      );

      /**
       * Store the challenge on the io store to check against later.
       */
      store.dispatch(challengeActions.insert(challengeEntity));

      outputStart.status = 200;
      outputStart.json.result = {
        [challengeKey]: [challengeEntity],
      };
      return outputStart;
    }

    /**
     * Must validate the registration input if it's defined.
     */
    const validateOutput = validate(validators.AuthRegister, body);
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
      publicKey as CryptoAsymPublicKey,
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

    const output = ioOutput();

    return outputRegistration;
  }
);

export const authProcessRegister = process;

export default { authProcessRegister };
