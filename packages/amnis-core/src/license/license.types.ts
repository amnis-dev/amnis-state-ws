import type { Reference } from '../core.types';

/**
 * License grants
 * Format: @<Type>:<Slice>:<Permit>
 *
 * Type: 'action' or 'select'
 *   'action' types perform some mutation to the data state.
 *   'select' types fetch information from the data state.
 *
 * Slice: The slice off of the Root data state that this is granted to.
 *
 * Permit: Name of the action or selection permitted.
 */
export type LicenseGrants = (`@action:${string}:${string}` | `@select:${string}:${string}`)[];

/**
 * A license for granting permission to perform actions or selections.
 */
export type License = {
  /**
   * Name of the license.
   */
  $name: Reference;

  /**
   * A brief description of the license.
   */
  description: string;

  /**
   * Permissions this license grants.
   */
  grants: LicenseGrants;
}
