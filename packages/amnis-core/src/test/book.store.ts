import {
  createEntityAdapter,
  createSlice,
  configureStore,
} from '@amnis/core/rtk';
import type { Entity, Meta } from '../entity/index.js';
import { coreExtraReducers, coreReducers } from '../reducers.js';
import { entityCreate } from '../entity/index.js';

export interface Book extends Entity {
  title: string;
  price: number;
}

export type BookMeta = Meta<Book>;

export const bookKey = 'book';

const booksAdapter = createEntityAdapter<Book>({
  // Assume IDs are stored in a field other than `book.id`
  selectId: (book) => book.$id,
  // Keep the "all IDs" array sorted based on book titles
  sortComparer: (a, b) => a.title.localeCompare(b.title),
});

export const booksSlice = createSlice({
  name: bookKey,
  initialState: booksAdapter.getInitialState<BookMeta>({
    active: null,
    focused: null,
    selection: [],
  }),
  reducers: {
    ...coreReducers(bookKey, booksAdapter),
  },
  extraReducers: (builder) => {
    coreExtraReducers<Book>(bookKey, booksAdapter, builder);
  },
});

export const storeSetup = () => configureStore({
  reducer: {
    [booksSlice.name]: booksSlice.reducer,
  },
});

export const books: Book[] = [
  entityCreate<Book>(bookKey, {
    title: 'Lord of the Rings',
    price: 12.85,
  }),
  entityCreate<Book>(bookKey, {
    title: 'Harry Potter',
    price: 9.98,
  }),
];

export default storeSetup;
