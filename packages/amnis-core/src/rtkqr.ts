/* eslint-disable @typescript-eslint/no-explicit-any */
import * as rtkQueryReact from '@reduxjs/toolkit/dist/query/react/index.js';

const rtkqr = ((rtkQueryReact as any).default ?? rtkQueryReact) as typeof rtkQueryReact;

export const {
  createApi: createApiReact,
  fetchBaseQuery: fetchBaseQueryReact,
} = rtkqr;

export default rtkqr;
