import * as toolkitRaw from '@reduxjs/toolkit';

export const rtk = ((toolkitRaw as any).default ?? toolkitRaw) as typeof toolkitRaw;

export default rtk;
