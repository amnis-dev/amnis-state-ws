import { userSlice, userSetSlice } from './user';

export const reducer = {
  [userSetSlice.name]: userSlice.reducer,
  [userSetSlice.name]: userSetSlice.reducer,
};

export default reducer;
