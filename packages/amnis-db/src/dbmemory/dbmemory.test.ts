import { uidList } from '@amnis/core';
import {
  books, bookKey,
} from '@amnis/core/test/book.store.js';
import { dbmemory, memoryClear } from './dbmemory.js';

/**
 * Clear memory storage after each run.
 */
afterEach(() => memoryClear());

/**
 * ============================================================
 */
test('memory db should create and store new book entity.', async () => {
  const result = await dbmemory.create({ [bookKey]: [books[0]] });

  expect(
    result,
  ).toEqual({
    [bookKey]: [books[0]],
  });
});

/**
 * ============================================================
 */
test('memory db should update existing book entity.', async () => {
  const result = await dbmemory.create({ [bookKey]: books });

  expect(
    result,
  ).toEqual({
    [bookKey]: books,
  });

  const updateResult = await dbmemory.update({
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
test('memory db should NOT select book with mismatching title.', async () => {
  await dbmemory.create({ [bookKey]: books });

  const result = await dbmemory.read({
    [bookKey]: {
      $query: {
        title: {
          $eq: 'Not Existing',
        },
      },
    },
  }, {
    scope: { [bookKey]: 'global' },
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
test('memory db should select book with matching title.', async () => {
  await dbmemory.create({ [bookKey]: books });

  const result = await dbmemory.read({
    [bookKey]: {
      $query: {
        title: {
          $eq: 'Lord of the Rings',
        },
      },
    },
  }, {
    scope: { [bookKey]: 'global' },
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
test('memory db should delete a book entity by id.', async () => {
  await dbmemory.create({ [bookKey]: books });

  const resultRead = await dbmemory.read({
    [bookKey]: {
      $query: {
        $id: {
          $eq: books[0].$id,
        },
      },
    },
  }, {
    scope: { [bookKey]: 'global' },
  });

  expect(
    resultRead,
  ).toEqual({
    [bookKey]: [books[0]],
  });

  const result = await dbmemory.delete({
    [bookKey]: uidList([books[0].$id]),
  });

  expect(
    result,
  ).toEqual({
    [bookKey]: [books[0].$id],
  });

  const resultRead2 = await dbmemory.read({
    [bookKey]: {
      $query: {
        $id: {
          $eq: books[0].$id,
        },
      },
    },
  }, {
    scope: { [bookKey]: 'global' },
  });

  expect(
    resultRead2,
  ).toEqual({
    [bookKey]: [],
  });
});