import { createGenerator, Config } from 'ts-json-schema-generator';
import fse from 'fs-extra';

const configCompleteTest: Config = {
  path: 'packages/amnis-core/src/test/book.store.ts',
  tsconfig: 'tsconfig.json',
  type: 'BookStateComplete',
};

const configPartialTest: Config = {
  path: 'packages/amnis-core/src/test/book.store.ts',
  tsconfig: 'tsconfig.json',
  type: 'BookStatePartial',
};

const configSelect: Config = {
  path: 'packages/amnis-core/src/types.ts',
  tsconfig: 'tsconfig.json',
  type: 'Select',
};

const configRemove: Config = {
  path: 'packages/amnis-core/src/types.ts',
  tsconfig: 'tsconfig.json',
  type: 'Remove',
};

const configCompleteState: Config = {
  path: 'packages/amnis-state/src/types.ts',
  tsconfig: 'tsconfig.json',
  type: 'StateComplete',
};

const configPartialState: Config = {
  path: 'packages/amnis-state/src/types.ts',
  tsconfig: 'tsconfig.json',
  type: 'StatePartial',
};

function gen(config: Config, output: string) {
  const schema = createGenerator(config).createSchema(config.type);
  fse.writeJSONSync(output, schema, { spaces: 2 });
}

gen(configCompleteState, 'packages/amnis-state/src/schema.complete.json');
gen(configPartialState, 'packages/amnis-state/src/schema.partial.json');

gen(configSelect, 'packages/amnis-core/src/schema.select.json');
gen(configRemove, 'packages/amnis-core/src/schema.remove.json');

gen(configCompleteTest, 'packages/amnis-core/src/test/book.schema.complete.json');
gen(configPartialTest, 'packages/amnis-core/src/test/book.schema.partial.json');
