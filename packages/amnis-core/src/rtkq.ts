/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/** @ts-ignore */
import * as rtkqRaw from '@reduxjs/toolkit/dist/query/rtk-query.esm.js';

const rtkq = rtkqRaw as typeof import('@reduxjs/toolkit/dist/query/index.d.js');

export const {
  createApi,
  fetchBaseQuery,
} = rtkq;

export default rtkq;
