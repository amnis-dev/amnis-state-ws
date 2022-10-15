---
to: "<%= path ? `${path}/${name}/index.ts` : null %>"
---

export * from './<%= name %>.types.js';
export * from './<%= name %>';
