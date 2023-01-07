import {
  Io,
  IoProcess,
  ApiAuthCredential,
  StateEntities,
  ioOutputApply,
} from '@amnis/core';
import {
  mwChallenge,
  mwCredential,
  mwSignature,
  mwValidate,
  mwOtp,
} from '../mw/index.js';
import { accountCredentialAdd, findUser } from '../utility/index.js';

const process: IoProcess<
Io<ApiAuthCredential, StateEntities>
> = (context) => (
  async (input, output) => {
    const { crypto } = context;
    const {
      body,
      otp,
    } = input;
    const {
      credential,
      password,
    } = body;

    if (!otp) {
      output.status = 500;
      output.json.logs.push({
        level: 'error',
        title: 'Invalid One-Time Password',
        description: 'A one-time password (OTP) is required to add a new agent credential.',
      });
      return output;
    }

    /**
     * Find the OTP subject.
     */
    const user = await findUser(context, otp.$sub);
    if (!user) {
      output.status = 401;
      output.json.logs.push({
        level: 'error',
        title: 'Subject Not Found',
        description: 'The subject for the credential could not be found.',
      });
      return output;
    }

    /**
     * Ensure the passwords are valid if a password is defined.
     */
    if (user.password) {
      if (!password) {
        output.status = 401;
        output.json.logs.push({
          level: 'error',
          title: 'Missing Password',
          description: 'The account password must be provided to add the new credential.',
        });
        return output;
      }
      const passwordMatch = await crypto.passCompare(password, user.password);

      if (!passwordMatch) {
        output.status = 401;
        output.json.logs.push({
          level: 'error',
          title: 'Invaid Password',
          description: 'The account password did not match.',
        });
        return output;
      }
    }

    /**
     * If it gets here, we can register the new credential with the user.
     */
    ioOutputApply(output, await accountCredentialAdd(context, user, credential));

    return output;
  }
);

export const processAuthCredential = mwValidate('ApiAuthCredential')(
  mwChallenge()(
    mwOtp()(
      mwCredential(true)(
        mwSignature()(
          process,
        ),
      ),
    ),
  ),
) as IoProcess<
Io<ApiAuthCredential, StateEntities>
>;

export default { processAuthCredential };
