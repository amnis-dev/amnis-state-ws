import { auditSlice } from './audit/index.js';
import { contactSlice } from './contact/index.js';
import { cryptoSlice } from './crypto/index.js';
import { historySlice } from './history/index.js';
import { localeSlice } from './locale/index.js';
import { logSlice } from './log/index.js';
import { noteSlice } from './note/index.js';
import { profileSlice } from './profile/index.js';
import { roleSlice } from './role/index.js';
import { serviceSlice } from './service/index.js';
import { sessionSlice } from './session/index.js';
import { systemSlice } from './system/index.js';
import { tokenSlice } from './token/index.js';
import { userSlice } from './user/index.js';
import { websiteSlice } from './website/index.js';

export const slices = {
  [auditSlice.name]: auditSlice,
  [contactSlice.name]: contactSlice,
  [cryptoSlice.name]: cryptoSlice,
  [historySlice.name]: historySlice,
  [localeSlice.name]: localeSlice,
  [logSlice.name]: logSlice,
  [noteSlice.name]: noteSlice,
  [profileSlice.name]: profileSlice,
  [roleSlice.name]: roleSlice,
  [serviceSlice.name]: serviceSlice,
  [sessionSlice.name]: sessionSlice,
  [systemSlice.name]: systemSlice,
  [tokenSlice.name]: tokenSlice,
  [userSlice.name]: userSlice,
  [websiteSlice.name]: websiteSlice,
};

export default slices;
