import type { EntityCreator, EntityCreatorBase } from '../entity.types.js';
import type { SheetDataRow } from './sheetdata.types.js';

/**
 * A data sheet for storing string or numeric data.
 * Much like an excel spreadsheet.
 */
export interface Sheet extends EntityCreator {
  /**
   * Row x Column array data.
   */
  data: SheetDataRow;
}

/**
 * Sheet properties excluding the extended entity properties.
 */
export type SheetBase = EntityCreatorBase<Sheet>;

/**
 * Base properties in order to create a log.
 */
export type SheetCreator = SheetBase;
