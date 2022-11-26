/**
 * Sheet Cell
 */
export type SheetDataCell = string | number;

/**
 * Sheet Column
 */
export type SheetDataColumn = Record<number, SheetDataCell>;

/**
 * Sheet Row
 */
export type SheetDataRow = Record<number, SheetDataColumn>;
