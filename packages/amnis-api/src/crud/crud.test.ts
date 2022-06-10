import {
  storeSetup, books, bookKey,
} from '@amnis/core/test/book.store';
import coreSchema from '@amnis/core/core.schema.json';
import bookSchema from '@amnis/core/test/book.schema.json';
import { memory, memoryClear } from '@amnis/db/memory';
import { apiCrudProcesses } from './crud.process';
import { ApiInput } from '../types';

const appStore = storeSetup();

const processes = apiCrudProcesses({
  store: appStore,
  database: memory,
  schemas: [coreSchema, bookSchema],
  definitions: {
    create: 'book#/definitions/BookState',
    update: 'book#/definitions/BookStatePartial',
  },
});

/**
 * Clear memory storage after each run.
 */
afterEach(() => memoryClear());

/**
 * ============================================================
 */
test('Handler should create new entities.', () => {
  const input: ApiInput = {
    body: {
      [bookKey]: books,
    },
  };

  const output = processes.create(input);

  expect(output.json.result).toEqual({ [bookKey]: books });
});

/**
 * ============================================================
 */
test('Handler should create entities that do not validate against the schema.', () => {
  const input: ApiInput = {
    body: {
      [bookKey]: [
        {
          this: 'is not',
          a: 'book',
        },
      ],
    },
  };

  const output = processes.create(input);

  expect(output.json.errors).toHaveLength(1);
  expect(output.json.errors[0].title).toEqual('Validation Error');
  expect(output.json.result).toEqual(undefined);
});

/**
 * ============================================================
 */
test('Handler should NOT create existing entities.', () => {
  const input: ApiInput = {
    body: {
      [bookKey]: books,
    },
  };

  processes.create(input);
  const output = processes.create(input);

  expect(output.json).toEqual({
    errors: [],
    result: {},
  });
});

/**
 * ============================================================
 */
test('Handler should read entities.', () => {
  processes.create({
    body: {
      [bookKey]: books,
    },
  });

  const output = processes.read({
    body: {
      [bookKey]: {
        $query: {
          title: {
            $eq: 'Lord of the Rings',
          },
        },
      },
    },
  });

  expect(
    output.json,
  ).toEqual({
    errors: [],
    result: { [bookKey]: [books[0]] },
  });
});

/**
 * ============================================================
 */
test('Handler should NOT read entities that do not exist.', () => {
  processes.create({
    body: {
      [bookKey]: books,
    },
  });

  const output = processes.read({
    body: {
      [bookKey]: {
        $query: {
          title: {
            $eq: 'Not the Rings',
          },
        },
      },
    },
  });

  expect(
    output.json,
  ).toEqual({
    errors: [],
    result: { [bookKey]: [] },
  });
});

/**
 * ============================================================
 */
test('Handler should be able to update existing entities.', () => {
  processes.create({
    body: {
      [bookKey]: books,
    },
  });

  const result = processes.update({
    body: {
      [bookKey]: [
        {
          $id: books[1].$id,
          title: 'Magic Tree House',
        },
      ],
    },
  });

  expect(
    result.json,
  ).toEqual({
    errors: [],
    result: { [bookKey]: [{ ...books[1], title: 'Magic Tree House' }] },
  });
});
