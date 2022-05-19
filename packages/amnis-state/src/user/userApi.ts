import { apiSlice } from '@amnis/query/slice';
import { User } from './user.types';

export const userApi = apiSlice<User>('user');

export default userApi;
