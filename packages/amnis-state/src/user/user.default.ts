import { entityCreate } from '@amnis/core/entity';
import type { User } from './user.types';

export const userDefault: User = entityCreate({
  displayName: 'Unnamed',
});

export default userDefault;
