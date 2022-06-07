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
  const result = memory.create({ [bookKey]: [books[0]] });

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
  const createResult = memory.create({ [bookKey]: books });

  expect(
    createResult,
  ).toEqual({
    [bookKey]: books,
  });

  const updateResult = memory.update({
    [bookKey]: [
      {
        $id: books[0].$id,
        price: 4.50,
      },
    ],
  });

  expect(
    updateResult,
  ).toEqual({
    [bookKey]: [{ ...books[0], price: 4.50 }],
  });
});

/**
 * ============================================================
 */
test('memory db should NOT select book with mismatching title.', () => {
  memory.create({ [bookKey]: books });

  const result = memory.read({
    [bookKey]: {
      title: {
        $eq: 'Not Existing',
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
  memory.create({ [bookKey]: books });

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

/**
 * ============================================================
 */
test('memory db should delete a book entity by id.', () => {
  memory.create({ [bookKey]: books });

  const resultRead = memory.read({
    [bookKey]: {
      $id: {
        $eq: books[0].$id,
      },
    },
  });

  expect(
    resultRead,
  ).toEqual({
    [bookKey]: [books[0]],
  });

  const result = memory.delete({
    [bookKey]: [books[0].$id],
  });

  expect(
    result,
  ).toEqual({
    [bookKey]: [books[0].$id],
  });

  const resultRead2 = memory.read({
    [bookKey]: {
      $id: {
        $eq: books[0].$id,
      },
    },
  });

  expect(
    resultRead2,
  ).toEqual({
    [bookKey]: [],
  });
});
