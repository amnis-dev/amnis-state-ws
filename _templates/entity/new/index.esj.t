---
to: <%= `packages/amnis-state/src/${category}/${name}/index.ts` %>
---
export * from './<%= name %>';
export * from './<%= name %>Set';
export * from './<%= name %>.types';
