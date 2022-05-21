---
to: <%= `${cwd}/${name}/${name}.mock.ts` %>
---
import { entityCreate } from '@amnis/core/entity';
import { entityApiMockServer } from '@amnis/query/entityApi/entityApi.mock';
import { <%= Name %> } from './<%= name %>.types';

export const userMockServer = entityApiMockServer('<%= name %>', {
  <%= name %>: [
    entityCreate<<%= Name %>>({
      displayName: 'eCrow',
    }),
    entityCreate<<%= Name %>>({
      displayName: 'Feemagie',
    }),
    entityCreate<<%= Name %>>({
      displayName: 'Koi',
    }),
    entityCreate<<%= Name %>>({
      displayName: 'Soapy',
    }),
    entityCreate<<%= Name %>>({
      displayName: 'LiquidFerret',
    }),
  ],
});

export default userMockServer;
