import { reference } from '../core';
import { roleKey } from '../role';
import { systemCreate, systemKey } from '../system';
import { websiteKey } from '../website';

import { stateReferenceQuery } from './state';
import { StateCreate, StateQuery } from './state.types';

const system = systemCreate({
  name: 'Query System',
  $adminRole: reference(roleKey),
  $initialRoles: [reference(roleKey), reference(roleKey)],
  $website: reference(websiteKey),
})[0];

system.$creator = system.$id;
system.$owner = system.$id;

const stateArray: StateCreate = {
  [systemKey]: [system],
};

/**
 * ============================================================
 */
test('should generate a proper reference query', () => {
  const stateQuery = stateReferenceQuery(stateArray);

  const expectation: StateQuery = {
    [roleKey]: {
      $query: {
        $id: {
          $in: [
            ...system.$initialRoles,
            system.$adminRole,
          ],
        },
      },
    },
    [websiteKey]: {
      $query: {
        $id: {
          $in: [
            system.$website,
          ],
        },
      },
    },
  };

  expect(stateQuery).toEqual(expectation);
});
