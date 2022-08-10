import { reference } from '../core.js';
import { roleKey } from '../role/index.js';
import { systemCreate, systemKey } from '../system/index.js';
import { websiteKey } from '../website/index.js';

import { stateReferenceQuery } from './state.js';
import { StateCreate, StateQuery } from './state.types.js';

const system = systemCreate({
  name: 'Query System',
  $adminRole: reference(roleKey),
  $initialRoles: [reference(roleKey), reference(roleKey)],
  $website: reference(websiteKey),
});

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
