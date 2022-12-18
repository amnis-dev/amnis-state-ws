import {
  ApiAuthRegistration,
  Io,
  IoProcess,
  StateEntities,
  apiAuthRegistrationParse,
  logCreator,
  userKey,
  Entity,
  User,
  ioOutputApply,
} from '@amnis/core';
import { systemSelectors } from '@amnis/state';
import { mwValidate } from '../mw/index.js';
import { authenticateLogin } from '../utility/authenticate.js';
import { challengeValidate } from '../utility/challenge.js';
import { registerAccount } from '../utility/register.js';

const process: IoProcess<
Io<ApiAuthRegistration, StateEntities>
> = (context) => (
  async (input, output) => {
    const { crypto, store } = context;
    const { body, access } = input;

    const system = systemSelectors.selectActive(store.getState());

    if (!system) {
      output.status = 500;
      output.json.logs.push(logCreator({
        level: 'error',
        title: 'Inactive System',
        description: 'There is no active system available to initalize the registration.',
      }));
      return output;
    }

    if (system.registrationOpen !== true) {
      const isAdmin = !!access?.roles.includes(system.$adminRole);
      const isExec = !!access?.roles.includes(system.$execRole);

      if (!isAdmin && !isExec) {
        output.status = 500;
        output.json.logs.push(logCreator({
          level: 'error',
          title: 'Registration Closed',
          description: 'The system has disabled registration.',
        }));
        return output;
      }
    }

    const authRegistrationParsed = await apiAuthRegistrationParse(body);

    /**
     * Ensure the auth registration parsing was successfull.
     */
    if (!authRegistrationParsed) {
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
    const challangeValidation = challengeValidate(
      context,
      challenge,
      {
        username: authRegistrationParsed.username,
      },
    );
    if (challangeValidation !== true) {
      return challangeValidation;
    }

    /**
     * Import the public key from the credential.
     */
    const publicKey = await crypto.keyImport(credential.publicKey);
    if (!publicKey) {
      output.status = 500; // Internal Server Error
      output.json.logs.push(logCreator({
        level: 'error',
        title: 'Public Key Not Found',
        description: 'Could not retrieve the public key from the request.',
      }));
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
      output.status = 500; // Internal Server Error
      output.json.logs.push(logCreator({
        level: 'error',
        title: 'Unrecognized Signature',
        description: 'Could not verify the requesting signature against the credential.',
      }));
      return output;
    }

    ioOutputApply(output, await registerAccount(
      context,
      authRegistrationParsed,
      input.ip,
    ));

    if (output.status !== 200) {
      return output;
    }

    const user = output.json.result?.[userKey]?.[0] as Entity<User>;

    if (!user) {
      output.status = 500; // Internal Server Error
      output.json.logs.push(logCreator({
        level: 'error',
        title: 'User Account Missing',
        description: 'User account was not provided from the registration event.',
      }));
      return output;
    }

    /**
     * With a successful registration, we can login the user with the
     * register account.
     */
    ioOutputApply(output, await authenticateLogin(context, user, credential.publicKey));

    return output;
  }
);

export const processAuthRegister = mwValidate('ApiAuthRegistration')(process);

export default { processAuthRegister };
