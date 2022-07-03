import { StateCreate } from '../state';
import { localeCreate, localeKey, tk } from './locale';

/**
 * English logs.
 */
export const localeDataEnLogs = localeCreate({
  code: 'en',
  set: 'logs',
  t: {
    [tk('error_required_name_title')]: 'Name Required',
    [tk('error_required_name_desc')]: 'The {0} name must be defined.',
  },
})[0];

/**
 * Initial data for locale state.
 */
export const localeDataEnCreate: StateCreate = {
  [localeKey]: [
    localeDataEnLogs,
  ],
};

export default { localeDataEnLogs, localeDataEnCreate };
