import {
  storeSetup, books, bookKey,
} from '@amnis/core/test/book.store';
import { memory, memoryClear } from '@amnis/db/memory';
import { apiCrudHandlersGenerate } from './crud.handlers';

const handlers = apiCrudHandlersGenerate();

/**
 * Clear memory storage after each run.
 */
afterEach(() => memoryClear());

/**
 * ============================================================
 */
test('Handler should create new entities.', () => {
  const bookStore = storeSetup();

  const result = handlers.create({
    body: {
      book: books,
    },
    store: bookStore,
    database: memory,
  });

  expect(
    result,
  ).toEqual({
    [bookKey]: books,
  });
});

/**
 * ============================================================
 */
test('Handler should NOT create existing entities.', () => {
  const bookStore = storeSetup();

  handlers.create({
    body: {
      book: books,
    },
    store: bookStore,
    database: memory,
  });

  const result = handlers.create({
    body: {
      book: books,
    },
    store: bookStore,
    database: memory,
  });

  expect(
    result,
  ).toEqual({});
});
