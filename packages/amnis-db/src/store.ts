import {
  createEntityAdapter,
  createSlice,
  configureStore,
} from '@reduxjs/toolkit';

export type Book = { $id: string; title: string };

const booksAdapter = createEntityAdapter<Book>({
  // Assume IDs are stored in a field other than `book.id`
  selectId: (book) => book.$id,
  // Keep the "all IDs" array sorted based on book titles
  sortComparer: (a, b) => a.title.localeCompare(b.title),
});

export const booksSlice = createSlice({
  name: 'books',
  initialState: booksAdapter.getInitialState(),
  reducers: {
    create: booksAdapter.addOne,
    createMany: booksAdapter.addMany,
  },
});

export const storeSetup = () => configureStore({
  reducer: {
    books: booksSlice.reducer,
  },
});

export default storeSetup;
