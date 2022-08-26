/**
 * Sheet Formats
 */
export type SheetStyle = {
  backgroundColor: string;
  color: string;
  fontWeight: 'normal' | 'bold';
  fontSize: number;
};

/**
 * Sheet Cell
 */
export type SheetStyleCell = SheetStyle;

/**
 * Sheet Column
 */
export type SheetStyleColumn = Record<number, SheetStyleCell>;

/**
 * Sheet Row
 */
export type SheetStyleRow = Record<number, SheetStyleColumn>;
