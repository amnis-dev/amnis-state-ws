/* eslint-disable @typescript-eslint/no-explicit-any */
import * as rtkqRaw from '@reduxjs/toolkit/dist/query/index.js';
import * as rtkqReactRaw from '@reduxjs/toolkit/dist/query/react/index.js';

const rtkq = (
  (rtkqRaw as any).default ?? rtkqRaw
) as typeof rtkqRaw;
const { reactHooksModule } = (
  (rtkqReactRaw as any).default ?? rtkqReactRaw
) as typeof rtkqReactRaw;

export const createApi = rtkq.buildCreateApi(
  rtkq.coreModule(),
  reactHooksModule(),
);

export const { fetchBaseQuery } = rtkq;

export default { createApi, fetchBaseQuery };
