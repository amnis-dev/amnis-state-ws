import { entityCreate } from '@amnis/core/entity';
import { entityApiMockServer } from '@amnis/query/entityApi/entityApi.mock';
import { User } from './user.types';

export const userMockServer = entityApiMockServer('user', {
  user: [
    entityCreate<User>({
      displayName: 'eCrow',
    }),
    entityCreate<User>({
      displayName: 'Feemagie',
    }),
    entityCreate<User>({
      displayName: 'Koi',
    }),
    entityCreate<User>({
      displayName: 'Soapy',
    }),
    entityCreate<User>({
      displayName: 'LiquidFerret',
    }),
  ],
});

export default userMockServer;
