/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LogLevel } from '../log/log.types.js';
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

const levels: LogLevel[] = [
  'fatal',
  'error',
  'success',
  'warn',
  'info',
  'debug',
];

export function ioOutputLevel(output: IoOutput): LogLevel | null {
  const level = output.json.logs.reduce<LogLevel | null>(
    (prev, curr) => {
      if (prev === null || levels.indexOf(prev) > levels.indexOf(curr.level)) {
        return curr.level;
      }
      return prev;
    },
    null,
  );

  return level;
}

export function ioOutputErrored(output: IoOutput): boolean {
  const errored = output.json.logs.some((l) => levels.indexOf(l.level) < 2);

  return errored;
}
