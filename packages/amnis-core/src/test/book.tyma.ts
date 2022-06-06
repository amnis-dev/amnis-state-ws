import type { Book } from './book.store';

export interface BookState {
  book?: Book[];
}

export interface BookStatePartial {
  book?: Partial<Book>[];
}
