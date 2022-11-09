/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/** @ts-ignore */
import * as rtkqRaw from '@reduxjs/toolkit/dist/query/rtk-query.esm.js';
/** @ts-ignore */
import * as rtkqrRaw from '@reduxjs/toolkit/dist/query/react/rtk-query-react.esm.js';
import type { CreateApi } from '@reduxjs/toolkit/dist/query/createApi.js';
import type { reactHooksModuleName } from '@reduxjs/toolkit/dist/query/react/module.js';

const rtkq = rtkqRaw as {
  fetchBaseQuery: typeof import('@reduxjs/toolkit/dist/query/index.d.js').fetchBaseQuery
};
const rtkqr = rtkqrRaw as {
  createApi: CreateApi<typeof import('@reduxjs/toolkit/dist/query/core/module.js').coreModuleName | typeof reactHooksModuleName>
};

export const {
  fetchBaseQuery,
} = rtkq;

export const {
  createApi,
} = rtkqr;

export default rtkqr;
