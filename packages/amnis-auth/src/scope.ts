import { AuthScope, Grant } from '@amnis/core/types';

/**
 * Creates a auth scope object from an array of grants.
 */
export function authScopeCreate(grants: Grant[]): AuthScope {
  const authScope: AuthScope = {};
  grants.forEach(({ key, scope }) => {
    authScope[key] = scope;
  });
  return authScope;
}

export default authScopeCreate;
