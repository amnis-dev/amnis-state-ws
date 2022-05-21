---
to: "<%= path ? `${path}/${name}/${name}.mock.ts` : null %>"
---
import { entityCreate } from '@amnis/core/entity';
import { entityApiMockServer } from '@amnis/query/entityApi/entityApi.mock';
import { <%= Name %> } from './<%= name %>.types';

export const <%= name %>MockServer = entityApiMockServer('<%= name %>', {
  <%= name %>: [
    entityCreate<<%= Name %>>({}),
    entityCreate<<%= Name %>>({}),
    entityCreate<<%= Name %>>({}),
  ],
});

export default <%= name %>MockServer;
