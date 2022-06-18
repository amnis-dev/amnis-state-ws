// import { reference, entityCreate } from '@amnis/core/core';
import { samples } from '@amnis/core/test/samples';
import { Database } from '@amnis/core/types';
import {
  profileKey, roleKey, userKey,
} from '@amnis/state/index';

export async function databaseSetup(database: Database) {
  await database.create({
    [roleKey]: samples.roles,
    [userKey]: samples.users,
    [profileKey]: samples.profiles,
  });
}

export default databaseSetup;
