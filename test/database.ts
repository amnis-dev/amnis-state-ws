// import { uid, entityCreate } from '@amnis/core/core';
import { samples } from '@amnis/core/test/samples';
import type { StateCreate } from '@amnis/core/state';
import type { Database } from '@amnis/db/types';
import {
  profileKey, roleKey, userKey,
} from '@amnis/state/index';
import { systemInitialize } from '@amnis/state/env.node';
import { Store } from '@reduxjs/toolkit';

export async function serviceSetup(store: Store, database: Database): Promise<StateCreate> {
  await systemInitialize(store, database, 'Amnis System');
  const result = await database.create({
    [roleKey]: samples.roles,
    [userKey]: samples.users,
    [profileKey]: samples.profiles,
  });

  return result;
}

export default serviceSetup;
