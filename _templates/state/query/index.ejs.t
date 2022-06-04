---
to: "<%= path ? `${path}/${name}/index.ts` : null %>"
---
export * from './<%= name %>.types';
export * from './<%= name %>.handlers';
export * from './<%= name %>.queries';
export * from './<%= name %>.node';
