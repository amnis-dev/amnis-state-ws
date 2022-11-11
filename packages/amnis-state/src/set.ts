import type { Middleware } from '@reduxjs/toolkit';
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

const reducers = {
  [auditSlice.name]: auditSlice.reducer,
  [contactSlice.name]: contactSlice.reducer,
  [cryptoSlice.name]: cryptoSlice.reducer,
  [historySlice.name]: historySlice.reducer,
  [localeSlice.name]: localeSlice.reducer,
  [logSlice.name]: logSlice.reducer,
  [noteSlice.name]: noteSlice.reducer,
  [profileSlice.name]: profileSlice.reducer,
  [roleSlice.name]: roleSlice.reducer,
  [serviceSlice.name]: serviceSlice.reducer,
  [sessionSlice.name]: sessionSlice.reducer,
  [systemSlice.name]: systemSlice.reducer,
  [tokenSlice.name]: tokenSlice.reducer,
  [userSlice.name]: userSlice.reducer,
  [websiteSlice.name]: websiteSlice.reducer,
};

const middleware: Middleware[] = [];

export const stateSet = {
  reducers,
  middleware,
};

export default stateSet;
