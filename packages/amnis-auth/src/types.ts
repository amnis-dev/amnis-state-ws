import type { GrantScope } from '@amnis/core/grant';
import type { State } from '@amnis/core/state';

/**
 * A stateful mapping of data access scopes.
 */
export type AuthScope = State<GrantScope>;
