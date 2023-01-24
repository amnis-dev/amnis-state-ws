import {
  ApiAuthRegister,
  Io,
  IoProcess,
  StateEntities,
  userKey,
  Entity,
  User,
  ioOutputApply,
  credentialKey,
  Credential,
} from '@amnis/core';
import { systemSelectors } from '@amnis/state';
import {
  mwChallenge,
  mwCredential,
  mwSignature,
  mwValidate,
} from '../mw/index.js';
import { authenticateFinalize } from '../utility/authenticate.js';
import { registerAccount } from '../utility/register.js';

const process: IoProcess<
Io<ApiAuthRegister, StateEntities>
> = (context) => (
  async (input, output) => {
    const { store } = context;
    const { body } = input;

    const system = systemSelectors.selectActive(store.getState());

    if (!system) {
      output.status = 503;
      output.json.logs.push({
        level: 'error',
        title: 'Inactive System',
        description: 'There is no active system available to initalize the registration.',
      });
      return output;
    }

    if (system.registrationOpen !== true) {
      output.status = 500;
      output.json.logs.push({
        level: 'error',
        title: 'Registration Closed',
        description: 'The system has disabled registration.',
      });
      return output;
    }

    ioOutputApply(output, await registerAccount(
      context,
      body,
      input.ip,
    ));

    if (output.status !== 200) {
      return output;
    }

    const user = output.json.result?.[userKey]?.[0] as Entity<User>;

    if (!user) {
      output.status = 500; // Internal Server Error
      output.json.logs.push({
        level: 'error',
        title: 'User Account Missing',
        description: 'User account was not provided from the registration event.',
      });
      return output;
    }

    const credential = output.json.result?.[credentialKey]?.[0] as Entity<Credential>;

    if (!credential) {
      output.status = 500; // Internal Server Error
      output.json.logs.push({
        level: 'error',
        title: 'Credential Missing',
        description: 'Credential information was not provided from the registration event.',
      });
      return output;
    }

    /**
     * With a successful registration, we can finalize the user login with the
     * registered account.
     */
    ioOutputApply(output, await authenticateFinalize(context, user.$id, credential.$id));

    return output;
  }
);

export const processAuthRegister = mwValidate('ApiAuthRegister')(
  mwChallenge()(
    mwCredential(true)(
      mwSignature()(
        process,
      ),
    ),
  ),
) as IoProcess<
Io<ApiAuthRegister, StateEntities>
>;

export default { processAuthRegister };
