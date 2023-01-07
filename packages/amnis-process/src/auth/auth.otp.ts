import {
  Io,
  IoProcess,
  ioOutputApply,
  Otp,
  Entity,
  ApiAuthOtp,
} from '@amnis/core';
import { mwValidate } from '../mw/index.js';
import { otpNew } from '../utility/otp.js';

const process: IoProcess<
Io<ApiAuthOtp, Otp>
> = (context) => (
  async (input, output) => {
    const { body: { $subject, email, purpose } } = input;

    ioOutputApply(
      output,
      await otpNew(context, {
        $subject,
        email,
        purpose,
      }),
    );
    return output;
  }
);

export const processAuthOtp = mwValidate('ApiAuthOtp')(
  process,
) as IoProcess<
Io<ApiAuthOtp, Entity<Otp>>
>;

export default { processAuthOtp };
