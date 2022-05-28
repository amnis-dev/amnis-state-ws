import { entityCreate, User } from '@amnis/core/index';

export const userDefault: User = entityCreate<User>({
  displayName: 'eCrow',
  $licenses: [],
  $permits: [],
});

export default userDefault;
