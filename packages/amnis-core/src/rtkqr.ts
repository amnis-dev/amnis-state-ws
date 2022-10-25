/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/** @ts-ignore */
import * as rtkqrRaw from '@reduxjs/toolkit/dist/query/react/rtk-query-react.esm.js';

const rtkqr = rtkqrRaw as typeof import('@reduxjs/toolkit/dist/query/index.d.js');

export const {
  createApi,
  fetchBaseQuery,
} = rtkqr;

export default rtkqr;
