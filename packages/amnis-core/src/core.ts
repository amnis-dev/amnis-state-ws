import { DateJSON, Grant, GrantString } from './core.types';

/**
 * Function for no operation.
 */
export const noop = () => { /** No operation. */ };

/**
 * Create a Date JSON string type.
 */
export const dateJSON = () => (new Date().toJSON() as DateJSON);

/**
 * Converts a grant to string format.
 */
export function grantToString(grant: Grant): GrantString {
  if (grant.type === '@action') {
    return `@action:${grant.path}:${grant.scope}:${grant.task}`;
  }
  return `@select:${grant.path}:${grant.scope}:${grant.task}`;
}

export default { noop, dateJSON, grantToString };
