// import { reference, entityCreate } from '@amnis/core/core';
import { samples } from '@amnis/core/test/samples';
import { memory } from '@amnis/db/memory';
import {
  profileKey, roleKey, userKey,
} from '@amnis/state/index';

export function databaseSetup() {
  memory.create({
    [roleKey]: samples.roles,
    [userKey]: samples.users,
    [profileKey]: samples.profiles,
  });

  return memory;
}

export default databaseSetup;
