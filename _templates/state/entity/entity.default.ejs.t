---
to: "<%= path ? `${path}/${name}/${name}.default.ts` : null %>"
---
import { <%= name %>Create, <%= name %>Base } from '@amnis/core/<%= name %>';

export const <%= name %>Default = <%= name %>Create(<%= name %>Base);

export default <%= name %>Default;
