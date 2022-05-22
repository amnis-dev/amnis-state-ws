---
to: "<%= `${cwd}/tsconfig.json` %>"
---
{
  "extends": "@amnis/tsconfig-node",
  "compilerOptions": {
    "baseUrl": "./",
    "types": ["node", "jest"],
    "paths": {
      "@amnis/mypackage/*": ["./packages/amnis-mypackage/src/*"],
    }
  },
  "include": ["./packages/**/*.ts*"]
}
