import type {
  ActionTask, SelectTask, Reference, GrantScope, TaskType,
} from '../core.types';

/**
 * License grant
 *
 * Type: 'action' or 'select'
 *   'action' types perform some mutation to the data state.
 *   'select' types fetch information from the data state.
 *
 * Path: The path off of the Root data state that this is granted to.
 *
 * Scope: The range of data that the task can be performed on.
 * Example: All, Owned
 *
 * Task: Name of the task to perform.
 *
 */
export type LicenseGrant = {
  type: '@action',
  path: `${string}.${string}`,
  scope: GrantScope,
  task: ActionTask
} | {
  type: '@select',
  path: `${string}.${string}`,
  scope: GrantScope,
  task: SelectTask
}

/**
 * License grant string.
 * Format: @<Type>:<Path>:<Scope>:<Task>
 *
 * @example
 * `@action:user.displayName:global:update`
 */
export type LicenseGrantString = (
  `@action:${string}.${string}:${GrantScope}:${ActionTask}` |
  `@select:${string}.${string}:${GrantScope}:${SelectTask}`
);

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
  grants: LicenseGrant[];
}
