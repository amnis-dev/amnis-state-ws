import { contactSlice } from './contact/index';
import { logSlice } from './log/index';
import { profileSlice } from './profile/index';
import { roleSlice } from './role/index';
import { sessionSlice } from './session/index';
import { systemSlice } from './system/index';
import { tokenSlice } from './token/index';
import { userSlice } from './user/index';
import { websiteSlice } from './website/index';

const reducers = {
  [contactSlice.name]: contactSlice.reducer,
  [logSlice.name]: logSlice.reducer,
  [profileSlice.name]: profileSlice.reducer,
  [roleSlice.name]: roleSlice.reducer,
  [sessionSlice.name]: sessionSlice.reducer,
  [systemSlice.name]: systemSlice.reducer,
  [tokenSlice.name]: tokenSlice.reducer,
  [userSlice.name]: userSlice.reducer,
  [websiteSlice.name]: websiteSlice.reducer,
};

const middleware: [] = [];

export const set = {
  reducers,
  middleware,
};

export default set;
