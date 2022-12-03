import {
  AuthRegister,
  challengeCreator,
  challengeKey,
  dateNumeric,
  entityCreate,
  Io,
  ioOutput,
  IoProcess,
  StateEntities,
  authRegisterParse,
  logCreator,
  CryptoAsymPublicKey,
} from '@amnis/core';
import { challengeActions } from '@amnis/state';
import { challengeValidate } from '../utility/challenge.js';
import { validate } from '../validate.js';

const process: IoProcess<
Io<AuthRegister, StateEntities>
> = (context) => (
  async (input) => {
    const { store, crypto, validators } = context;
    const { body } = input;

    /**
     * When the body is undefined, output data necessary to begin the
     * registration ritual.
     */
    if (!body) {
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
          expires: dateNumeric('15m'),
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

    const authRegisterParsed = await authRegisterParse(body);

    /**
     * Ensure the auth registration parsing was successfull.
     */
    if ('level' in authRegisterParsed) {
      const output = ioOutput();
      output.status = 500; // Internal Server Error
      output.json.logs = [authRegisterParsed];
      return output;
    }

    const { challenge, credential, signature } = authRegisterParsed;

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

    const outputRegister = ioOutput();

    return outputRegister;
  }
);

export const authProcessRegister = process;

export default { authProcessRegister };
