import {
  storeSetup, books, bookKey,
} from '@amnis/core/test/book.store';
import coreSchema from '@amnis/core/core.schema.json';
import bookSchema from '@amnis/core/test/book.schema.json';
import { memory, memoryClear } from '@amnis/db/memory';
import { dateNumeric, reference } from '@amnis/core/core';
import type { ResultCreate } from '@amnis/core/state';
import type { JWTDecoded } from '@amnis/core/token';

import type { ApiInput } from '../types';
import { apiCrudProcesses } from './crud.process';

const appStore = storeSetup();

/**
 * Setup the crud processes.
 */
const processes = apiCrudProcesses({
  store: appStore,
  database: memory,
  schemas: [coreSchema, bookSchema],
  definitions: {
    create: 'book#/definitions/BookState',
    update: 'book#/definitions/BookStatePartial',
  },
});

const expires = dateNumeric(new Date(Date.now() + 60000));
/**
 * Create a JWT token in order to execute processes.
 */
const jwt: JWTDecoded = {
  iss: 'core',
  sub: reference('user', 'system'),
  exp: expires,
  iat: expires,
  typ: 'access',
  adm: true,
  roles: [],
};

/**
 * Clear memory storage after each run.
 */
afterEach(() => memoryClear());

/**
 * ============================================================
 */
test('Handler should create new entities.', async () => {
  const input: ApiInput = {
    body: {
      [bookKey]: books,
    },
    jwt,
  };

  const output = await processes.create(input);

  expect(output.json.result).toBeDefined();

  const result = output.json.result as ResultCreate;

  expect(result).toEqual({ [bookKey]: books });
});

/**
 * ============================================================
 */
test('Handler should create entities that do not validate against the schema.', async () => {
  const input: ApiInput = {
    body: {
      [bookKey]: [
        {
          this: 'is not',
          a: 'book',
        },
      ],
    },
    jwt,
  };

  const output = await processes.create(input);

  expect(output.json.errors).toHaveLength(1);
  expect(output.json.errors[0].title).toEqual('Validation Error');
  expect(output.json.result).toEqual(undefined);
});

/**
 * ============================================================
 */
test('Handler should read entities.', async () => {
  await processes.create({
    body: {
      [bookKey]: books,
    },
    jwt,
  });

  const output = await processes.read({
    body: {
      [bookKey]: {
        $query: {
          title: {
            $eq: 'Lord of the Rings',
          },
        },
      },
    },
    jwt,
  });

  expect(
    output.json.result,
  ).toEqual({ [bookKey]: [books[0]] });

  expect(
    output.json.logs,
  ).toHaveLength(0);
});

/**
 * ============================================================
 */
test('Handler should NOT read entities that do not exist.', async () => {
  await processes.create({
    body: {
      [bookKey]: books,
    },
    jwt,
  });

  const output = await processes.read({
    body: {
      [bookKey]: {
        $query: {
          title: {
            $eq: 'Not the Rings',
          },
        },
      },
    },
    jwt,
  });

  expect(
    output.json,
  ).toEqual({
    errors: [],
    result: { [bookKey]: [] },
    reids: {},
    logs: [],
  });
});

/**
 * ============================================================
 */
test('Handler should be able to update existing entities.', async () => {
  await processes.create({
    body: {
      [bookKey]: books,
    },
    jwt,
  });

  const result = await processes.update({
    body: {
      [bookKey]: [
        {
          $id: books[1].$id,
          title: 'Magic Tree House',
        },
      ],
    },
    jwt,
  });

  expect(
    result.json,
  ).toEqual({
    errors: [],
    result: { [bookKey]: [{ ...books[1], title: 'Magic Tree House' }] },
    reids: {},
    logs: [],
  });
});
