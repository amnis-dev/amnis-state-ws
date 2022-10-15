import { Grant, Task } from '@amnis/core/grant/index.js';
import { AuthScope } from './types.js';

/**
 * Creates a auth scope object from an array of grants.
 */
export function authScopeCreate(grants: Grant[], attempt: Task): AuthScope {
  const authScope: AuthScope = {};
  grants.forEach(({ key, scope, task }) => {
    // eslint-disable-next-line no-bitwise
    if ((task & attempt) === attempt) {
      authScope[key] = scope;
    }
  });
  return authScope;
}

export default authScopeCreate;
