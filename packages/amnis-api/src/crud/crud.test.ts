import {
  storeSetup, books, bookKey,
} from '@amnis/core/test/book.store';
import bookStateCompleteSchema from '@amnis/core/test/book.schema.complete.json';
import bookStatePartialSchema from '@amnis/core/test/book.schema.partial.json';
import { memory, memoryClear } from '@amnis/db/memory';
import { Session } from '@amnis/core/types';
import { dateJSON, entityCreate, reference } from '@amnis/core/core';
import { apiCrudHandlersGenerate } from './crud.handlers';

const session: Session = entityCreate<Session>('session', {
  name: 'SomeUser',
  $user: reference('user', ''),
  expires: dateJSON(),
  grants: [
    'book:global:15',
  ],
});

const handlers = apiCrudHandlersGenerate({
  storeGenerator: storeSetup,
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
    session,
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
    session,
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
    session,
  });

  const result = handlers.create({
    body: {
      book: books,
    },
    session,
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
    session,
  });

  const result = handlers.read({
    body: {
      book: {
        title: {
          $eq: 'Lord of the Rings',
        },
      },
    },
    session,
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
    session,
  });

  const result = handlers.read({
    body: {
      book: {
        title: {
          $eq: 'Not the Rings',
        },
      },
    },
    session,
  });

  expect(
    result,
  ).toEqual({
    errors: [],
    result: { [bookKey]: [] },
  });
});
