import type { Book } from './book.store.js';

export interface StateCreate {
  book?: Book[];
}

export interface StateUpdate {
  book?: Partial<Book>[];
}
