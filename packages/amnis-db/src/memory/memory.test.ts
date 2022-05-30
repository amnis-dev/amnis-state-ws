import {
  storeSetup, booksSlice, books, bookKey,
} from '@amnis/core/test/book.store';
import { memory, memoryClear } from './memory';

/**
 * Clear memory storage after each run.
 */
afterEach(() => memoryClear());

/**
 * ============================================================
 */
test('memory db should create and store new book entity.', () => {
  const store = storeSetup();

  store.dispatch(booksSlice.actions.create(books[0]));

  const result = memory.create(store.getState());

  expect(
    result,
  ).toEqual({
    [bookKey]: [books[0]],
  });
});

/**
 * ============================================================
 */
test('memory db should update existing book entity.', () => {
  const store = storeSetup();

  store.dispatch(booksSlice.actions.create(books[0]));

  const createResult = memory.create(store.getState());

  expect(
    createResult,
  ).toEqual({
    [bookKey]: [books[0]],
  });

  store.dispatch(booksSlice.actions.update({
    $id: books[0].$id,
    price: 4.50,
  }));

  const updateResult = memory.update(store.getState());

  expect(
    updateResult,
  ).not.toEqual({
    [bookKey]: [books[0]],
  });
});

/**
 * ============================================================
 */
test('memory db should NOT select book with mismatching title.', () => {
  const store = storeSetup();

  store.dispatch(booksSlice.actions.create(books[0]));

  memory.create(store.getState());

  const result = memory.read({
    [bookKey]: {
      title: {
        $eq: 'Harry Potter',
      },
    },
  });

  expect(
    result,
  ).toEqual({
    [bookKey]: [],
  });
});

/**
 * ============================================================
 */
test('memory db should select book with matching title.', () => {
  const store = storeSetup();

  store.dispatch(booksSlice.actions.createMany(books));

  memory.create(store.getState());

  const result = memory.read({
    [bookKey]: {
      title: {
        $eq: 'Lord of the Rings',
      },
    },
  });

  expect(
    result,
  ).toEqual({
    [bookKey]: [books[0]],
  });
});
