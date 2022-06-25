import fse from 'fs-extra';
import path from 'path';
import glob from 'glob';

import Ajv from 'ajv';
import standaloneCode from 'ajv/dist/standalone';

const ajv = new Ajv({ code: { source: true, optimize: true }, allErrors: false });

const schemaFiles = glob.sync('./packages/amnis-core/src/schemas/*.schema.json', {
  nodir: true,
  ignore: './**/node_modules/**',
});

schemaFiles.forEach((schemaPath) => {
  const prefix = path.basename(schemaPath).split('.')[0];
  const schema = fse.readJSONSync(schemaPath);
  const validate = ajv.compile(schema);
  const moduleCode = standaloneCode(ajv, validate);
  fse.writeFileSync(`./packages/amnis-core/src/validators/${prefix}.validate.js`, moduleCode);
});
