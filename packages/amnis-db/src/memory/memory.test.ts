import { reIdentify } from '@amnis/core/core';
import {
  books, bookKey,
} from '@amnis/core/test/book.store';
import { memory, memoryClear } from './memory';

/**
 * Clear memory storage after each run.
 */
afterEach(() => memoryClear());

/**
 * ============================================================
 */
test('memory db should create and store new book entity.', async () => {
  const [result, reids] = await memory.create({ [bookKey]: [books[0]] });
  const booksReid = reIdentify(books, reids[bookKey]);

  expect(
    result,
  ).toEqual({
    [bookKey]: [booksReid[0]],
  });
});

/**
 * ============================================================
 */
test('memory db should update existing book entity.', async () => {
  const [createResult, reids] = await memory.create({ [bookKey]: books });
  const booksReid = reIdentify(books, reids[bookKey]);

  expect(
    createResult,
  ).toEqual({
    [bookKey]: booksReid,
  });

  const updateResult = await memory.update({
    [bookKey]: [
      {
        $id: booksReid[0].$id,
        price: 4.50,
      },
    ],
  });

  expect(
    updateResult,
  ).toEqual({
    [bookKey]: [{ ...booksReid[0], price: 4.50 }],
  });
});

/**
 * ============================================================
 */
test('memory db should NOT select book with mismatching title.', async () => {
  await memory.create({ [bookKey]: books });

  const result = await memory.read({
    [bookKey]: {
      $query: {
        title: {
          $eq: 'Not Existing',
        },
      },
    },
  }, { [bookKey]: 'global' });

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
  const [, reids] = await memory.create({ [bookKey]: books });
  const booksReid = reIdentify(books, reids[bookKey]);

  const result = await memory.read({
    [bookKey]: {
      $query: {
        title: {
          $eq: 'Lord of the Rings',
        },
      },
    },
  }, { [bookKey]: 'global' });

  expect(
    result,
  ).toEqual({
    [bookKey]: [booksReid[0]],
  });
});

/**
 * ============================================================
 */
test('memory db should delete a book entity by id.', async () => {
  const [, reids] = await memory.create({ [bookKey]: books });
  const booksReid = reIdentify(books, reids[bookKey]);

  const resultRead = await memory.read({
    [bookKey]: {
      $query: {
        $id: {
          $eq: booksReid[0].$id,
        },
      },
    },
  }, { [bookKey]: 'global' });

  expect(
    resultRead,
  ).toEqual({
    [bookKey]: [booksReid[0]],
  });

  const result = await memory.delete({
    [bookKey]: [booksReid[0].$id],
  });

  expect(
    result,
  ).toEqual({
    [bookKey]: [booksReid[0].$id],
  });

  const resultRead2 = await memory.read({
    [bookKey]: {
      $query: {
        $id: {
          $eq: booksReid[0].$id,
        },
      },
    },
  }, { [bookKey]: 'global' });

  expect(
    resultRead2,
  ).toEqual({
    [bookKey]: [],
  });
});
