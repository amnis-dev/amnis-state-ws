import {
  storeSetup, books, bookKey,
} from '@amnis/core/test/book.store';
import bookStateSchema from '@amnis/core/test/book.schema.json';
import { memory, memoryClear } from '@amnis/db/memory';
import { apiCrudHandlersGenerate } from './crud.handlers';

const handlers = apiCrudHandlersGenerate({
  storeGenerator: storeSetup,
  databaseInterface: memory,
  schemaComplete: bookStateSchema,
  schemaPartial: bookStateSchema,
});

/**
 * Clear memory storage after each run.
 */
afterEach(() => memoryClear());

/**
 * ============================================================
 */
test('Handler should create new entities.', () => {
  const result = handlers.create({
    body: {
      book: books,
    },
  });

  expect(
    result,
  ).toEqual({
    errors: [],
    result: { [bookKey]: books },
  });
});

/**
 * ============================================================
 */
test('Handler should create entities that do not validate against the schema.', () => {
  const result = handlers.create({
    body: {
      book: [
        {
          this: 'is not',
          a: 'book',
        },
      ],
    },
  });

  expect(result.errors).toHaveLength(1);
  expect(result.errors[0].title).toEqual('Validation Error');
  expect(result.result).toEqual({});
});

/**
 * ============================================================
 */
test('Handler should NOT create existing entities.', () => {
  handlers.create({
    body: {
      book: books,
    },
  });

  const result = handlers.create({
    body: {
      book: books,
    },
  });

  expect(
    result,
  ).toEqual({
    errors: [],
    result: {},
  });
});

/**
 * ============================================================
 */
test('Handler should read entities.', () => {
  handlers.create({
    body: {
      book: books,
    },
  });

  const result = handlers.read({
    body: {
      book: {
        title: {
          $eq: 'Lord of the Rings',
        },
      },
    },
  });

  expect(
    result,
  ).toEqual({
    errors: [],
    result: { [bookKey]: [books[0]] },
  });
});

/**
 * ============================================================
 */
test('Handler should NOT read entities that do not exist.', () => {
  handlers.create({
    body: {
      book: books,
    },
  });

  const result = handlers.read({
    body: {
      book: {
        title: {
          $eq: 'Not the Rings',
        },
      },
    },
  });

  expect(
    result,
  ).toEqual({
    errors: [],
    result: { [bookKey]: [] },
  });
});
