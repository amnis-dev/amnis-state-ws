---
to: "<%= path ? `${path}/${name}/${name}.default.ts` : null %>"
---
import { entityCreate } from '@amnis/core/index';
import { <%= name %>Key } from './<%= name %>';
import type { <%= Name %> } from './<%= name %>.types';

export const <%= name %>Default: <%= Name %> = entityCreate<<%= Name %>>(<%= name %>Key, {
  myProperty: 'Unnamed',
});

export default <%= name %>Default;
