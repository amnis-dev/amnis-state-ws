import { storeSetup, booksSlice, Book } from '../store';
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

  const bookItem: Book = {
    $id: '1',
    title: 'Lord of the Rings',
  };

  store.dispatch(booksSlice.actions.create(bookItem));

  const result = memory.create(store.getState());

  expect(
    result,
  ).toEqual({
    books: [bookItem],
  });
});

/**
 * ============================================================
 */
test('memory db should NOT select book with mismatching title.', () => {
  const store = storeSetup();

  const bookItem: Book = {
    $id: '1',
    title: 'Lord of the Rings',
  };

  store.dispatch(booksSlice.actions.create(bookItem));

  memory.create(store.getState());

  const result = memory.select({
    books: {
      title: {
        $eq: 'Harry Potter',
      },
    },
  });

  expect(
    result,
  ).toEqual({
    books: [],
  });
});

/**
 * ============================================================
 */
test('memory db should select book with matching title.', () => {
  const store = storeSetup();

  const bookItems: Book[] = [
    {
      $id: '1',
      title: 'Lord of the Rings',
    },
    {
      $id: '2',
      title: 'Harry Potter',
    },
  ];

  store.dispatch(booksSlice.actions.createMany(bookItems));

  memory.create(store.getState());

  const result = memory.select({
    books: {
      title: {
        $eq: 'Lord of the Rings',
      },
    },
  });

  expect(
    result,
  ).toEqual({
    books: [bookItems[0]],
  });
});
