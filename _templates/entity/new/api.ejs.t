---
to: <%= `packages/amnis-state/src/${name}/${name}Api.ts` %>
---
import { apiSlice } from '@amnis/query/slice';
import { <%= Name %> } from './<%= name %>.types';

export const <%= name %>Api = apiSlice<<%= Name %>>('<%= name %>');

export default <%= name %>Api;
