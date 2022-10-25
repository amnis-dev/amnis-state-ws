// import { uid, entityCreate } from '@amnis/core/core.js';
import { profileKey, roleKey, userKey, } from '@amnis/core';
import type { StateCreate, Database } from '@amnis/core';
import { systemInitialize } from '@amnis/state';
import type { Store } from '@reduxjs/toolkit';

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
