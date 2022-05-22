---
to: "<%= `${cwd}/tsconfig.json` %>"
---
{
  "extends": "@amnis/tsconfig-react",
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@amnis/mypackage/*": ["./packages/amnis-mypackage/src/*"],
    }
  },
  "include": ["./packages/**/*.ts*"]
}
