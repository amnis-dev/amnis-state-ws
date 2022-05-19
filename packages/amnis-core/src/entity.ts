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
   * Type of entity.
   */
  readonly type: unique symbol;

  /**
   * Creation date string.
   * @default ""
   */
  readonly dateCreated: string;

  /**
   * Updated date string.
   * @default ""
   */
  dateUpdated: string;
}

/**
 * A Reference to an Entity.
 */
export type EntityReference<T extends Entity> = T['type'];
