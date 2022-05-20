import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true,
  testEnvironment: 'node',
  fakeTimers: {
    enableGlobally: true,
  },
};

export default config;
