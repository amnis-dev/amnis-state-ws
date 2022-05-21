---
to: <%= `${cwd}/${name}/${name}.default.ts` %>
---
import { entityCreate } from '@amnis/core/entity';
import type { <%= Name %> } from './<%= name %>.types';

export const userDefault: <%= Name %> = entityCreate({
  displayName: 'Unnamed',
});

export default userDefault;
