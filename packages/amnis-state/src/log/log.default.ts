import { logCreate } from '@amnis/core';

export const logDefault = logCreate({
  level: 'debug',
  title: 'Log Entry',
  description: 'This is a default log entry.',
});

export default logDefault;
