import {
  storeSetup, books, bookKey,
} from '@amnis/core/test/book.store';
import bookStateCompleteSchema from '@amnis/core/test/book.schema.complete.json';
import bookStatePartialSchema from '@amnis/core/test/book.schema.partial.json';
import { memory, memoryClear } from '@amnis/db/memory';
import { apiCrudHandlersSetup } from './msgraph.handlers';

const handlers = apiCrudHandlersSetup({
  storeSetup,
  databaseInterface: memory,
  schemaComplete: bookStateCompleteSchema,
  schemaPartial: bookStatePartialSchema,
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
