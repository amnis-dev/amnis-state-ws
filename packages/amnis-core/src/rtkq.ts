/* eslint-disable @typescript-eslint/no-explicit-any */
import * as rtkQuery from '@reduxjs/toolkit/dist/query/index.js';

const rtkq = ((rtkQuery as any).default ?? rtkQuery) as typeof rtkQuery;

export const {
  createApi,
  fetchBaseQuery,
} = rtkq;

export default rtkq;
