/**
 * Sheet Formats
 */
export type SheetFormat = {
  number: Intl.NumberFormatOptions;
  datetime: Intl.DateTimeFormatOptions;
};

/**
 * Sheet Cell
 */
export type SheetFormatCell = SheetFormat;

/**
 * Sheet Column
 */
export type SheetFormatColumn = Record<number, SheetFormatCell>;

/**
 * Sheet Row
 */
export type SheetFormatRow = Record<number, SheetFormatColumn>;
