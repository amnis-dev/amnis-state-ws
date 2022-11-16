import type { Book } from './book.store.js';

export interface StateCreator {
  book?: Book[];
}

export interface StateUpdater {
  book?: Partial<Book>[];
}
