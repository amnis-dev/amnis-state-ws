import { dateNumeric } from '../../core.js';
import { uid } from '../../uid.js';
import { Otp, OtpMethod } from './otp.types.js';

export const otpKey = 'otp';

export const otpBase = (): Omit<Otp, '$id'> => ({
  $sub: uid('subject'),
  len: 12,
  exp: dateNumeric('5m'),
  mth: OtpMethod.None,
});

export const otpCreate = (
  otp: Omit<Otp, '$id' | 'len'> & { $id?: Otp['$id']},
): Otp => {
  const otpNew: Otp = {
    ...otpBase(),
    ...otp,
    $id: uid(otpKey),
    len: otp.val?.length ?? 0,
  };

  return otpNew;
};
