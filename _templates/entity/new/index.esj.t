---
to: <%= `packages/amnis-state/src/${name}/index.ts` %>
---
export * from './<%= name %>';
export * from './<%= name %>Set';
export * from './<%= name %>Api';
export * from './<%= name %>.types';
