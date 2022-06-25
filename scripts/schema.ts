import { createGenerator } from 'ts-json-schema-generator';
import fse from 'fs-extra';
import path from 'path';
import glob from 'glob';

const typeSchemaFiles = glob.sync('./**/*.tyma.ts', {
  nodir: true,
  ignore: './**/node_modules/**',
});

typeSchemaFiles.forEach((filePath) => {
  const dir = path.dirname(filePath);
  const prefix = path.basename(filePath).split('.')[0];
  const schema = createGenerator({
    schemaId: prefix,
    path: filePath,
    tsconfig: 'tsconfig.json',
    type: '*',
  }).createSchema('*');
  fse.writeJSONSync(`${dir}/${prefix}.schema.json`, schema, { spaces: 2 });
});

const coreSchemaFiles = glob.sync('./packages/amnis-core/src/types/*.types.ts', {
  nodir: true,
  ignore: './**/node_modules/**',
});

coreSchemaFiles.every((filePath) => {
  // const dir = path.dirname(filePath);
  const prefix = path.basename(filePath).split('.')[0];
  if (prefix === 'database') {
    return true;
  }
  const schema = createGenerator({
    schemaId: `core-${prefix}`,
    path: filePath,
    tsconfig: 'tsconfig.json',
    type: prefix.charAt(0).toUpperCase() + prefix.slice(1),
  }).createSchema('*');
  fse.writeJSONSync(`./packages/amnis-core/src/schemas/${prefix}.schema.json`, schema, { spaces: 2 });
  return true;
});
