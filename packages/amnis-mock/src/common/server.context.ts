import { schemaAuth, schemaEntity } from '@amnis/core';
import { validateSetup } from '@amnis/process';
import { ContextOptions } from '@amnis/state';

export const serverContextOptions: ContextOptions = {
  initialize: true,
  validators: validateSetup([schemaAuth, schemaEntity]),
};

export default serverContextOptions;
