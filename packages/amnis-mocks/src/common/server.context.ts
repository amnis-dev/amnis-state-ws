import { schemaAuth, schemaEntity } from '@amnis/core';
import { validateSetup } from '@amnis/process';
import { contextSetup } from '@amnis/state';

export const serverContext = async () => contextSetup({
  initialize: true,
  validators: validateSetup([schemaAuth, schemaEntity]),
});

export default serverContext;
