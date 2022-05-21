---
to: <%= `${cwd}/${name}/index.ts` %>
---
export * from './<%= name %>';
export * from './<%= name %>.types';
export * from './<%= name %>.default';
