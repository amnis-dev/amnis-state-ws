import type { Chrono, ChronoEntityRecords } from './chrono.types.js';

export const chronoKey = 'chrono';

export const chronoBase: Chrono = {
  past: [],
  future: [],
  records: {} as ChronoEntityRecords,
};
