/**
 * Data scopes.
 */
export type GrantScope = 'global' | 'owned';

/**
 * Data tasks.
 */
// eslint-disable-next-line no-shadow
export enum Task {
  None = 0,
  Create = 1,
  Read = 2,
  Update = 4,
  Delete = 8,
}

/**
  * Grant object.
  */
export type Grant = {
  key: string;
  scope: GrantScope;
  task: Task;
};

/**
  * Role grant string.
  */
export type GrantString = string;
