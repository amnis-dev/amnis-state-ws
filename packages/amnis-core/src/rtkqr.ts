/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/** @ts-ignore */
import * as rtkqRaw from '@reduxjs/toolkit/dist/query/rtk-query.esm.js';
/** @ts-ignore */
import * as rtkqReactRaw from '@reduxjs/toolkit/dist/query/react/rtk-query-react.esm.js';

const rtkq = (
  (rtkqRaw as any).default ?? rtkqRaw
) as typeof import('@reduxjs/toolkit/dist/query/index.d.js');
const { reactHooksModule } = (
  (rtkqReactRaw as any).default ?? rtkqReactRaw
) as typeof import('@reduxjs/toolkit/dist/query/react/index.d.js');
const createApi = rtkq.buildCreateApi(
  rtkq.coreModule(),
  reactHooksModule(),
);

export const rtkqr = { ...rtkq, createApi };

export default rtkqr;
