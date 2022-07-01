import { roleSlice } from './role';
import { sessionSlice } from './session';
import { userSlice } from './user';
import { profileSlice } from './profile';
import { logSlice } from './log';

export const reducerMap = {
  [roleSlice.name]: roleSlice.reducer,
  [sessionSlice.name]: sessionSlice.reducer,
  [userSlice.name]: userSlice.reducer,
  [profileSlice.name]: profileSlice.reducer,
  [logSlice.name]: logSlice.reducer,
};

export const reducerMiddleware = [];

export default { reducerMap };
