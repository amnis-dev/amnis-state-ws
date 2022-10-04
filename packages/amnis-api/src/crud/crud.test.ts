import {
  storeSetup, books, bookKey,
} from '@amnis/core/test/book.store';
import coreSchema from '@amnis/core/core.schema.json';
import bookSchema from '@amnis/core/test/book.schema.json';
import { memory, memoryClear } from '@amnis/db/memory';
import { dateNumeric, identifier } from '@amnis/core/core';
import type { StateCreate } from '@amnis/core/state';
import type { JWTEncoded } from '@amnis/core/token';
import { validatorsSetup } from '@amnis/api/validators';
import { apiIO } from '@amnis/api/api.io.node';

import { jwtEncode } from '@amnis/auth/token';
import { historyKey } from '@amnis/core/history';
import type { ApiInput } from '../types';
import { apiCrudProcess } from './crud.process';

const appStore = storeSetup();

const validators = validatorsSetup([coreSchema, bookSchema]);

/**
 * Setup the crud io.
 */
const io = apiIO({
  store: appStore,
  database: memory,
  validators,
}, apiCrudProcess);

const expires = dateNumeric(new Date(Date.now() + 60000));
/**
 * Create a JWT token in order to execute io.
 */
const jwtEncoded: JWTEncoded = jwtEncode({
  iss: 'core',
  sub: identifier('user', 'system'),
  exp: expires,
  iat: expires,
  typ: 'access',
  adm: true,
  roles: [],
});

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
    jwtEncoded,
  };

  const output = await io.create(input);

  expect(output.json.result).toBeDefined();

  const result = output.json.result as StateCreate;

  expect(result).toEqual({ [bookKey]: books });
});

/**
 * ============================================================
 */
test('Handler should fail when a jwt token is not provided.', async () => {
  const input: ApiInput = {
    body: {
      [bookKey]: books,
    },
  };

  const output = await io.create(input);

  expect(output.json.result).not.toBeDefined();

  expect(output.json.logs).toHaveLength(1);
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
    jwtEncoded,
  };

  const output = await io.create(input);

  expect(output.json.logs).toHaveLength(1);
  expect(output.json.logs[0].title).toEqual('Validation Failed');
  expect(output.json.result).toEqual(undefined);
});

/**
 * ============================================================
 */
test('Handler should read entities.', async () => {
  await io.create({
    body: {
      [bookKey]: books,
    },
    jwtEncoded,
  });

  const output = await io.read({
    body: {
      [bookKey]: {
        $query: {
          title: {
            $eq: 'Lord of the Rings',
          },
        },
      },
    },
    jwtEncoded,
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
  await io.create({
    body: {
      [bookKey]: books,
    },
    jwtEncoded,
  });

  const output = await io.read({
    body: {
      [bookKey]: {
        $query: {
          title: {
            $eq: 'Not the Rings',
          },
        },
      },
    },
    jwtEncoded,
  });

  expect(
    output.json,
  ).toEqual({
    result: { [bookKey]: [] },
    logs: [],
  });
});

/**
 * ============================================================
 */
test('Handler should be able to update existing entities.', async () => {
  await io.create({
    body: {
      [bookKey]: books,
    },
    jwtEncoded,
  });

  const updateObject = {
    $id: books[1].$id,
    title: 'Magic Tree House',
  };

  const result = await io.update({
    body: {
      [bookKey]: [updateObject],
    },
    jwtEncoded,
  });

  expect(
    result.json.result[bookKey],
  ).toEqual([{ ...books[1], title: 'Magic Tree House' }]);

  expect(
    result.json.logs,
  ).toEqual([]);

  expect(
    result.json.result[historyKey][0],
  ).toEqual(expect.objectContaining({
    $subject: books[1].$id,
    update: updateObject,
  }));
});
