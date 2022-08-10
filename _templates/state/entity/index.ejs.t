---
to: "<%= path ? `${path}/${name}/index.ts` : null %>"
---
export * from './<%= name %>.js';
export * from './<%= name %>.types.js';
export * from './<%= name %>.default.js';
export * from '@amnis/core/<%= name %>.js';