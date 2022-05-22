import { apiMockGenerateHandlers, apiMockServer } from '@amnis/core/api/api.mock';
import { entityApiHandlersGenerate } from '@amnis/query/entityApi';
import { userStoreSetup } from './user.store';

const mockStore = userStoreSetup();

const mockHandlers = apiMockGenerateHandlers('user', entityApiHandlersGenerate());

export const userMockServer = apiMockServer(mockHandlers);

export default userMockServer;
