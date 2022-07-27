import type { Book } from './book.store';

export interface StateCreate {
  book?: Book[];
}

export interface StateUpdate {
  book?: Partial<Book>[];
}
