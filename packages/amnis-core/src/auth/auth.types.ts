import { Reference, Group } from '../core.types';

/**
 * Primary Authentication mapping.
 */
export interface Auth {
  [id: Reference]: Group[];
}

/**
 * Authentication schema.
 */
export type AuthSchema<
  State extends Record<string, unknown> = Record<string, unknown>,
  Actions extends string[] = string[],
  Selectors extends string[] = string[],
> = {
  [group: Group]: {
    [Slice in keyof State]: {
      actions: Actions[],
      selectors: Selectors[],
    }
  }
}
