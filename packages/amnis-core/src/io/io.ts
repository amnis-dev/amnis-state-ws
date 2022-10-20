/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  IoMap, IoOutput, IoProcesses, IoContext,
} from './io.types.js';

export function ioProcess<
  P extends IoProcesses = IoProcesses,
>(
  context: IoContext,
  processes: P,
) {
  const io = Object.keys(processes).reduce<IoMap<keyof P>>(
    (record, key) => {
      record[key as keyof P] = processes[key](context);
      return record;
    },
    {} as IoMap<keyof P>,
  );

  return io;
}

export function ioOutput<T = any>(): IoOutput<T> {
  return {
    status: 200, // 200 OK
    cookies: {},
    json: {
      logs: [],
      result: undefined,
      expire: undefined,
    },
  };
}
