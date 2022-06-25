---
to: "<%= path ? `${path}/${name}/${name}.default.ts` : null %>"
---
import { <%= Name %>, entityCreate } from '@amnis/core/index';
import { <%= name %>Key } from './<%= name %>';

export const <%= name %>Default: <%= Name %> = entityCreate<<%= Name %>>(<%= name %>Key, {
  myProperty: 'Unnamed',
});

export default <%= name %>Default;
