---
to: "<%= path ? `${path}/${name}/${name}.default.ts` : null %>"
---
import { entityCreate } from '@amnis/core/entity';
import type { <%= Name %> } from './<%= name %>.types';

export const <%= name %>Default: <%= Name %> = entityCreate({
  displayName: 'Unnamed',
});

export default <%= name %>Default;
