import { uid } from '../uid.js';
import { roleKey } from '../role/index.js';
import { systemCreate, systemKey } from '../system/index.js';
import { websiteKey } from '../website/index.js';

import { stateReferenceQuery, stateToCreate } from './state.js';
import { StateCreate, StateQuery } from './state.types.js';

const system = systemCreate({
  name: 'Query System',
  $adminRole: uid(roleKey),
  $execRole: uid(roleKey),
  $initialRoles: [uid(roleKey), uid(roleKey)],
  $website: uid(websiteKey),
});

system.$creator = system.$id;
system.$owner = system.$id;

const stateBasic = {
  users: {
    entities: {
      a1: {
        name: 'User1',
      },
      a2: {
        name: 'User2',
      },
    },
  },
  session: {
    noEntities: false,
  },
  messages: {
    entities: {
      b1: {
        text: 'Message1',
      },
      b2: {
        text: 'Message2',
      },
    },
  },
};

const stateArray: StateCreate = {
  [systemKey]: [system],
};

/**
 * ============================================================
 */
test('should generate a proper identifier query', () => {
  const stateQuery = stateReferenceQuery(stateArray);

  const expectation: StateQuery = {
    [roleKey]: {
      $query: {
        $id: {
          $in: [
            ...system.$initialRoles,
            system.$execRole,
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

/**
 * ============================================================
 */
test('should convert state to create state object', () => {
  const stateCreate = stateToCreate(stateBasic);

  const values = Object.values(stateCreate);
  expect(values).toHaveLength(2);
  values.forEach((entities) => {
    expect(Array.isArray(entities)).toEqual(true);
    expect(entities).toHaveLength(2);
  });
});
