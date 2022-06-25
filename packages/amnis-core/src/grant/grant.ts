/* eslint-disable no-bitwise */
import {
  GrantScope,
  Grant,
  GrantString,
  Task,
} from './grant.types';

/**
 * Converts a grant to string format.
 */
export function grantStringify(grant: Grant): GrantString {
  return `${grant.key}:${grant.scope}:${grant.task}`;
}

/**
 * Converts a grant string to a grant object.
 */
export function grantParse(grant: GrantString): Grant | undefined {
  const [key, scope, tasks] = grant.split(':');

  if (typeof key !== 'string') {
    return undefined;
  }

  if (typeof scope !== 'string') {
    return undefined;
  }

  if (!['global', 'owned'].includes(scope)) {
    return undefined;
  }

  const taskValue: Task = parseInt(tasks, 10);

  if (typeof taskValue !== 'number') {
    return undefined;
  }

  if (taskValue < 0 || taskValue > 15) {
    return undefined;
  }

  return {
    key,
    scope: scope as GrantScope,
    task: taskValue,
  };
}

/**
 * Creates a task integer from an array.
 */
export function task(
  create: number,
  read: number,
  update: number,
  remove: number,
): number {
  let value = Task.None;

  if (create) { value |= Task.Create; }
  if (read) { value |= Task.Read; }
  if (update) { value |= Task.Update; }
  if (remove) { value |= Task.Delete; }

  return value;
}
