import type { CoreRole } from './auth.types';
import type { Reference } from './core.types';
import { Entity } from './entity.types';
import { CoreWebsite } from './website.types';

export interface CoreSystem extends Entity {
  /**
   * Name of the system.
   */
  name: string;

  /**
   * Number in minutes that an authentication session should live.
   * @default 60
   */
  sessionExpires: number;

  /**
   * System's website configurations.
   */
  $website: Reference<CoreWebsite>;

  /**
   * The initial roles to assign to a user when a new account is created.
   * @default []
   */
  $initialRoles: Reference<CoreRole>[];
}
