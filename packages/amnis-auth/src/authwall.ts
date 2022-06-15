import {
  Grant, State, Task,
} from '@amnis/core/types';

/**
 * Authorization wall that filters out state slices based on grants.
 *
 * This only strips slices off a state based on the grant key and attempted task.
 * This does NOT consider grant scope. That must be handled by the database interface.
 *
 * It does return a scope state map for the database to use.
 */
export function authwall(state: State, grants: Grant[], attempt: Task): [State, string[]] {
  const sanitized: State = {};
  const denied: string[] = [];

  grants.every(({ key, task }) => {
    // eslint-disable-next-line no-bitwise
    if ((task & attempt) !== attempt) {
      if (state[key]) {
        denied.push(key);
      }
      return true;
    }

    if (!state[key]) {
      return true;
    }

    sanitized[key] = state[key];

    return true;
  });

  return [sanitized, denied];
}

export default authwall;
