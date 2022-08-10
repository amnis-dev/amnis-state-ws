---
to: "<%= path ? `${path}/${name}/index.ts` : null %>"
---
export * from './<%= name %>.types.js';
export * from './<%= name %>.handlers.js';
export * from './<%= name %>.queries.js';
export * from './<%= name %>.node.js';
