import {
  ApiContext, ApiIOs, ApiProcesses,
} from './types.js';

export function apiIO<
  P extends ApiProcesses = ApiProcesses,
>(
  context: ApiContext,
  processes: P,
) {
  const io = Object.keys(processes).reduce<ApiIOs<keyof P>>(
    (record, key) => {
      record[key as keyof P] = processes[key](context);
      return record;
    },
    {} as ApiIOs<keyof P>,
  );

  return io;
}

export default { apiIO };
