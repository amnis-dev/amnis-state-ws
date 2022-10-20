import type { State, Grant, Task } from '@amnis/core/index.js';

/**
 * Authorization wall that filters out state slices based on grants.
 *
 * This only strips slices off a state based on the grant key and attempted task.
 * This does NOT consider grant scope. That must be handled by the database interface.
 *
 * It does return a scope state map for the database to use.
 */
export function authorizeWall(state: State, grants: Grant[], attempt: Task): State {
  const sanitized: State = {};

  grants.every(({ key, task }) => {
    // eslint-disable-next-line no-bitwise
    if ((task & attempt) !== attempt) {
      return true;
    }

    if (!state[key]) {
      return true;
    }

    sanitized[key] = state[key];

    return true;
  });

  return sanitized;
}

export default authorizeWall;
