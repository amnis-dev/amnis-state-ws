import {
  Io,
  IoProcess,
  ioOutputApply,
  ApiAuthChallenge,
  Challenge,
  challengeCreate,
  Entity,
  UID,
  base64Decode,
} from '@amnis/core';
import { systemSelectors } from '@amnis/state';
import { mwValidate } from '../mw/index.js';
import { challengeNew } from '../utility/challenge.js';
import { findUserById } from '../utility/find.js';

const process: IoProcess<
Io<ApiAuthChallenge, Challenge>
> = (context) => (
  async (input, output) => {
    const { store, crypto, send } = context;
    const { body, sessionEncrypted } = input;
    const system = systemSelectors.selectActive(store.getState());

    if (!system) {
      output.status = 500;
      output.json.logs.push({
        level: 'error',
        title: 'Inactive System',
        description: 'There is no active system available to generate a challenge.',
      });
      return output;
    }

    const {
      subject,
      email,
      purpose,
      signature: signatureEncoded,
    } = body;

    if (subject === undefined) {
      ioOutputApply(output, await challengeNew(context));
      return output;
    }

    /**
     * Ensure the subject is an existing user.
     */
    const user = await findUserById(context, subject as UID);

    if (!user) {
      output.json.logs.push({
        level: 'error',
        title: 'Cannot Find Subject',
        description: 'The subject id cannot be found.',
      });
      return output;
    }

    /**
     * Check if the challenge creator has a session.
     */
    const session = sessionEncrypted ? await crypto.sessionDecrypt(sessionEncrypted) : undefined;

    /**
     * Generate the challenge code output.
     */
    const outputChallenge = await challengeNew(
      context,
      { $subject: subject as UID, privatize: true },
    );

    const resultChallenge = outputChallenge.json.result;

    /**
     * Return the fail output if the challenge could not be created.
     */
    if (!resultChallenge) {
      return {
        ...outputChallenge,
        json: {
          ...outputChallenge.json,
          result: undefined,
        },
      };
    }

    const { otp } = resultChallenge;
    if (!otp) {
      output.json.logs.push({
        level: 'error',
        title: 'Challenge Creation Failed',
        description: 'Generating challenge could not be completed.',
      });
      return output;
    }

    /**
     * Apply the output result.
     */
    output.json.result = challengeCreate({
      exp: resultChallenge.exp,
      val: resultChallenge.val,
      $sub: resultChallenge.$sub,
    });
    output.json.result.$id = resultChallenge.$id;

    /**
     * If the session holder is a privileged account, also send back the challenge OTP.
     */
    if (session?.prv === true && signatureEncoded) {
      /**
       * that the signature is valid.
       */
      const signature = base64Decode(signatureEncoded).buffer;
      const publicKey = await crypto.keyImport(session.pub);
      const isValidSignature = await crypto.asymVerify(subject, signature, publicKey);
      /**
       * If the signature is valid, return to one-time-passcode.
       * Administrators can encode it into a URL and send it to the trusted person.
       */
      if (isValidSignature) {
        output.json.result.otp = otp;
      }
    }

    /**
     * If the email is set, send to one-time-passcode to the subject's email.
     */
    if (email && user.email === email && user.emailVerified === true) {
      const emailSubject = ((p: typeof purpose): string => {
        switch (p) {
          case 'adddevice':
            return 'Register New Device Request';
          case 'resetpass':
            return 'Reset Password Request';
          case 'register':
            return 'Registration Request';
          case 'confirm':
            return 'Email Confirmation';
          default:
            return 'One Time Passcode';
        }
      })(purpose);

      send.email({
        to: email,
        from: system.emailAuth,
        fromName: system.name,
        subject: emailSubject,
        text: `Use the following confirmation code to complete the process: "${otp}"`,
      });
    }

    return output;
  }
);

export const processAuthChallenge = mwValidate('ApiAuthChallenge')(
  process,
) as IoProcess<
Io<ApiAuthChallenge, Entity<Challenge>>
>;

export default { processAuthChallenge };
