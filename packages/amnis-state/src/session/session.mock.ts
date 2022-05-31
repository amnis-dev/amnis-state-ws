import { entityCreate } from '@amnis/core/entity';
import { entityApiMockServer } from '@amnis/api/entityApi/entityApi.mock';
import { Session } from './session.types';

export const sessionMockServer = entityApiMockServer('session', {
  session: [
    entityCreate<Session>({}),
    entityCreate<Session>({}),
    entityCreate<Session>({}),
  ],
});

export default sessionMockServer;
