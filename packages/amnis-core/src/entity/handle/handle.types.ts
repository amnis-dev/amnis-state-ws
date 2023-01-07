import type { UID } from '../../types.js';
import type { EntityCreator, EntityCreatorBase, EntityCreatorParams } from '../entity.types.js';

/**
 * Human-freindly name to reference a particular subject.
 *
 * @pattern ^[A-Za-z0-9_-]+$
 * @minLength 1
 * @maxLength 24
 */
export type HandleName = string;

/**
 * Human-freindly name to reference a particular subject within an ID string.
 *
 * @pattern ^@[A-Za-z0-9_-]+$
 * @minLength 1
 * @maxLength 24
 */
export type HandleNameId = string;

/**
 * Handles contain unique names that reference a particular subject.
 * The subject is typically a user.
 */
export interface Handle extends EntityCreator {
  /**
   * The handle name.
   */
  name: HandleName;

  /**
   * The subject this handle references.
   */
  $subject: UID;
}

/**
 * Handle properties excluding the extended entity properties.
 */
export type HandleBase = EntityCreatorBase<Handle>;

/**
 * Base properties.
 */
export type HandleCreator = EntityCreatorParams<Handle, 'name' | '$subject'>;
