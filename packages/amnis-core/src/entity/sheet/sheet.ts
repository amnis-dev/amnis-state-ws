import type { EntityCreator } from '../entity.types.js';
import { uid } from '../../uid.js';
import type { Sheet, SheetBase, SheetBaseCreate } from './sheet.types.js';

export const sheetKey = 'sheet';

export const sheetBase: SheetBase = {
  data: {},
};

export function sheetCreator(
  sheet: SheetBaseCreate,
): EntityCreator<Sheet> {
  return {
    ...sheetBase,
    ...sheet,
    $id: uid(sheetKey),
  };
}
