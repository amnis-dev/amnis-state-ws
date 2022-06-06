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
  storeSetup,
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
    store: appStore,
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
    store: appStore,
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
    store: appStore,
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
    store: appStore,
    body: {
      [bookKey]: books,
    },
  });

  const result = processes.read({
    store: appStore,
    body: {
      [bookKey]: {
        title: {
          $eq: 'Lord of the Rings',
        },
      },
    },
  });

  expect(
    result.json,
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
    store: appStore,
    body: {
      [bookKey]: books,
    },
  });

  const result = processes.read({
    store: appStore,
    body: {
      [bookKey]: {
        title: {
          $eq: 'Not the Rings',
        },
      },
    },
  });

  expect(
    result.json,
  ).toEqual({
    errors: [],
    result: { [bookKey]: [] },
  });
});
