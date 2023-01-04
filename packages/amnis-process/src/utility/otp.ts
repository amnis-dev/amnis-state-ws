import {
  ApiAuthOtp,
  dateNumeric,
  IoContext,
  IoOutput,
  ioOutput,
  Otp,
  otpCreate,
} from '@amnis/core';
import {
  systemSelectors,
  otpActions,
  otpSelectors,
} from '@amnis/state';
import { validate } from '../validate.js';
import { findUserById } from './find.js';

const alphabet = 'abcdefghijklmnopqrstuvwxyz';

/**
 * Generate an OTP password
 */
export const otpPasswordCreate = async (context: IoContext, length = 8): Promise<string> => {
  let value = await context.crypto.randomString(length);
  const specialChars = value.match(/[^a-z^A-Z^0-9]/gm);
  specialChars?.forEach((c) => {
    value = value.replace(
      c,
      alphabet.charAt(
        Math.floor(Math.random() * alphabet.length),
      ),
    );
  });
  value = value.toLowerCase();
  return value;
};

/**
 * Create a OTP from context and output it.
 */
export const otpNew = async (
  context: IoContext,
  body: ApiAuthOtp,
): Promise<IoOutput<Otp>> => {
  const output = ioOutput();
  const { store, send } = context;
  const { $subject, email } = body;

  const system = systemSelectors.selectActive(store.getState());

  if (!system) {
    output.status = 500;
    output.json.logs.push({
      level: 'error',
      title: 'Inactive System',
      description: 'There is no active system available to generate one-time passwords.',
    });
    return output;
  }

  const user = await findUserById(context, $subject);

  if (!user) {
    output.status = 401; // Unauthorized
    output.json.logs.push({
      level: 'error',
      title: 'No Subject Found',
      description: 'Could not find the subject for this OTP.',
    });
    return output;
  }

  const optPassword = await otpPasswordCreate(context, system.otpLength);

  const otp = otpCreate({
    $sub: $subject,
    val: optPassword,
    exp: dateNumeric(`${system.otpExpiration}m`),
  });

  /**
   * Store the challenge on the io store to check against later.
   */
  store.dispatch(otpActions.insert(otp));

  /**
   * Send the OTP to the subject's email if they match and it's verified.
   */
  if (email && user.email === email && user.emailVerified === true) {
    send.email({
      to: email,
      from: system.emailAuth,
      fromName: system.name,
      subject: 'One-Time Password',
      text: `Use the following one-time password (OTP) to complete the process: "${optPassword}"`,
    });
  }

  /**
   * The output result should not contain the OTP value.
   */
  const otpResult: Otp = {
    $id: otp.$id,
    $sub: otp.$sub,
    exp: otp.exp,
    len: otp.len,
  };
  output.status = 200;
  output.json.result = otpResult;
  return output;
};

/**
 * Validate a OTP from context.
 */
export const otpValidate = async (
  context: IoContext,
  otp: Otp,
): Promise<true | IoOutput> => {
  const output = ioOutput();
  const { store, validators } = context;

  /**
   * Validate the structure of the OTP.
   */
  const outputValidate = validate(validators.Otp, otp);
  if (outputValidate) {
    return outputValidate;
  }

  /**
   * Verify that the OTP code is valid.
   */
  const otpServer = otpSelectors.selectById(store.getState(), otp.$id);

  /**
   * OTP not found on the server store or doesn't match.
   */
  if (!otpServer) {
    output.status = 401; // Not Authorized
    output.json.logs = [{
      level: 'error',
      title: 'Invalid One-Time Password',
      description: 'The provided one-time password (OTP) is not valid.',
    }];
    return output;
  }

  store.dispatch(otpActions.delete(otp.$id));

  if (otp.val !== otpServer.val) {
    output.status = 401; // Not Authorized
    output.json.logs = [{
      level: 'error',
      title: 'Invalid One-Time Password',
      description: 'The provided one-time password (OTP) is incorrect.',
    }];
    return output;
  }

  /**
   * OTP cannot be used if expired.
   * Expired OTPs are cleaned up later.
   */
  if (otp.exp <= dateNumeric()) {
    output.status = 401; // Not Authorized
    output.json.logs = [{
      level: 'error',
      title: 'One-Time Password Expired',
      description: 'The one-time password (OTP) has expired.',
    }];
    return output;
  }

  /**
   * Ensure that the OTP subject matches.
   */
  if (otpServer.$sub !== otp.$sub) {
    output.status = 401; // Not Authorized
    output.json.logs = [{
      level: 'error',
      title: 'Invalid One-Time Password',
      description: 'This one-time password (OTP) cannot be used for this subject.',
    }];
    return output;
  }

  /**
   * Ensure the length is valid.
   */
  if (otpServer.len !== otp.val?.length) {
    output.status = 401; // Not Authorized
    output.json.logs = [{
      level: 'error',
      title: 'Invalid One-Time Password',
      description: 'The one-time password (OTP) expects a different number of characters',
    }];
    return output;
  }

  /**
   * Remove the OTP from the server store once verified.
   */
  store.dispatch(otpActions.delete(otp.$id));

  return true;
};
