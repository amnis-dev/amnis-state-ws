/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/** @ts-ignore */
import * as rtkRaw from '@reduxjs/toolkit/dist/redux-toolkit.esm.js';

export const rtk = rtkRaw as typeof import('@reduxjs/toolkit/dist/index.d.js');

export default rtk;
