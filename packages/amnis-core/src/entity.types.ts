import type { DateJSON } from './common.types';

/**
 * A common entity object.
 */
export interface Entity {
  /**
   * Identifier for this entity.
   * @default ""
   */
  readonly id: string;

  /**
   * Creation date string.
   * @default ""
   */
  readonly dateCreated: DateJSON;

  /**
   * Updated date string.
   * @default ""
   */
  dateUpdated: DateJSON;

  /**
   * Possible creator of the entity.
   */
  readonly entityCreator: string | null;

  /**
   * Possible updater of the entity.
   */
  entityUpdater: string | null;
}

/**
 * Unique reference symbol to define a reference of a specific type.
 */
declare const entitySymbol: unique symbol;

/**
  * A id reference for specific entity.
  */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type EntityReference<E extends Entity> = string & {[entitySymbol]: never};

/**
 * Omitted types of the core Entity interface.
 */
export type EntityOmit<E> = Omit<E, keyof Entity>

/**
 * Type for Entity Creation
 */
export type EntityCreate<E extends Entity> = EntityOmit<E>;

/**
 * Type for an Entity Updating
 */
export type EntityUpdate<E extends Entity> = Partial<EntityOmit<E>>;
