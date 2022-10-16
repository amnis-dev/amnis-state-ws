// import { uid, entityCreate } from '@amnis/core/core.js';
import { samples } from '@amnis/core/test/samples.js';
import type { StateCreate } from '@amnis/core/state/index.js';
import type { Database } from '@amnis/core/database.types.js';
import {
  profileKey, roleKey, userKey,
} from '@amnis/state/index.js';
import { systemInitialize } from '@amnis/state/env.node/index.js';
import type { Store } from '@reduxjs/toolkit/index.js';

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
