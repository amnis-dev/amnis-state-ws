import { memory } from '@amnis/db/memory';
import { roleKey, userKey } from '@amnis/state/index';
import { samples } from '@amnis/core/test/samples';

export function databaseSetup() {
  memory.create({
    [roleKey]: samples.roles,
    [userKey]: samples.users,
  });

  return memory;
}

export default databaseSetup;
