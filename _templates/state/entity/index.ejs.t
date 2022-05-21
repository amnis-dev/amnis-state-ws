---
to: "<%= path ? `${path}/${name}/index.ts` : null %>"
---
export * from './<%= name %>';
export * from './<%= name %>.types';
export * from './<%= name %>.default';
