import type { Entity, EntityExtension } from '../entity/index.js';
import type { SheetDataRow } from './sheetdata.types.js';

/**
 * A data sheet for storing string or numeric data.
 * Much like an excel spreadsheet.
 */
export interface Sheet extends Entity {
  /**
   * Row x Column array data.
   */
  data: SheetDataRow;
}

/**
 * Sheet properties excluding the extended entity properties.
 */
export type SheetBase = EntityExtension<Sheet>;

/**
 * Base properties in order to create a log.
 */
export type SheetBaseCreate = SheetBase;
