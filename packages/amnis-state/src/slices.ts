import { auditSlice } from './audit/index.js';
import { bearerSlice } from './bearer/index.js';
import { challengeSlice } from './challenge/index.js';
import { contactSlice } from './contact/index.js';
import { credentialSlice } from './credential/index.js';
import { handleSlice } from './handle/handle.js';
import { keySlice } from './key/index.js';
import { historySlice } from './history/index.js';
import { localeSlice } from './locale/index.js';
import { logSlice } from './log/index.js';
import { noteSlice } from './note/index.js';
import { otpSlice } from './otp/otp.js';
import { profileSlice } from './profile/index.js';
import { roleSlice } from './role/index.js';
import { serviceSlice } from './service/index.js';
import { sessionSlice } from './session/index.js';
import { systemSlice } from './system/index.js';
import { userSlice } from './user/index.js';

export const slices = {
  [auditSlice.name]: auditSlice,
  [bearerSlice.name]: bearerSlice,
  [challengeSlice.name]: challengeSlice,
  [contactSlice.name]: contactSlice,
  [credentialSlice.name]: credentialSlice,
  [handleSlice.name]: handleSlice,
  [keySlice.name]: keySlice,
  [historySlice.name]: historySlice,
  [localeSlice.name]: localeSlice,
  [logSlice.name]: logSlice,
  [noteSlice.name]: noteSlice,
  [otpSlice.name]: otpSlice,
  [profileSlice.name]: profileSlice,
  [roleSlice.name]: roleSlice,
  [serviceSlice.name]: serviceSlice,
  [sessionSlice.name]: sessionSlice,
  [systemSlice.name]: systemSlice,
  [userSlice.name]: userSlice,
};

export default slices;
