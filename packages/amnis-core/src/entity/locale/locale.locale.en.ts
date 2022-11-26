import type { StateCreator } from '../../state/index.js';
import { localeCreator, localeKey, tk } from './locale.js';

/**
 * English logs.
 */
export const localeDataEnLogs = localeCreator({
  code: 'en',
  set: 'logs',
  t: {
    [tk('error_required_name_title')]: 'Name Required',
    [tk('error_required_name_desc')]: 'The {0} name must be defined.',
  },
  v: ['system'],
});

/**
 * Initial data for locale state.
 */
export const localeDataEnCreate: StateCreator = {
  [localeKey]: [
    localeDataEnLogs,
  ],
};

export default { localeDataEnLogs, localeDataEnCreate };
