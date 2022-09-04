import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true,
  testEnvironment: 'node',
  fakeTimers: {
    enableGlobally: true,
  },
  modulePathIgnorePatterns: [
    '.srv',
    '.lib',
    '.pkg',
    '.dist',
    '.web',
    '.out',
  ],
  collectCoverage: true,
  coverageReporters: ['json', 'html'],
};

export default config;
