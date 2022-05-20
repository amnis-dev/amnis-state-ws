import { entityCreate } from '@amnis/core/entity';
import { mockServer } from '@amnis/query/mock';
import { User } from './user.types';

export const userMockServer = mockServer<User>('user', {
  user: [
    entityCreate({
      displayName: 'eCrow',
    }),
    entityCreate({
      displayName: 'Feemagie',
    }),
    entityCreate({
      displayName: 'Koi',
    }),
    entityCreate({
      displayName: 'Soapy',
    }),
    entityCreate({
      displayName: 'LiquidFerret',
    }),
  ],
});

export default userMockServer;
