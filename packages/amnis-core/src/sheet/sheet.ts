import { entityCreate } from '../entity/index.js';
import type { Sheet, SheetBase, SheetBaseCreate } from './sheet.types.js';

export const sheetKey = 'sheet';

export const sheetBase: SheetBase = {
  data: {},
};

export function sheetCreate(
  sheet: SheetBaseCreate,
): Sheet {
  const sheetEntity = entityCreate<Sheet>(sheetKey, {
    ...sheetBase,
    ...sheet,
  });

  return sheetEntity;
}
