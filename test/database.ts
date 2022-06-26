// import { reference, entityCreate } from '@amnis/core/core';
import { samples } from '@amnis/core/test/samples';
import type { ResultCreate } from '@amnis/core/state';
import type { Database } from '@amnis/db/types';
import {
  profileKey, roleKey, userKey,
} from '@amnis/state/index';

export async function databaseSetup(database: Database): Promise<ResultCreate> {
  const result = await database.create({
    [roleKey]: samples.roles,
    [userKey]: samples.users,
    [profileKey]: samples.profiles,
  });

  return result;
}

export default databaseSetup;
