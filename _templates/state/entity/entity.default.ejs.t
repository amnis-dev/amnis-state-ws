---
to: "<%= path ? `${path}/${name}/${name}.default.ts` : null %>"
---
import { <%= name %>Create } from '@amnis/core/<%= name %>';

export const [<%= name %>Default] = <%= name %>Create({
  myProperty: 'Unnamed',
});

export default <%= name %>Default;
