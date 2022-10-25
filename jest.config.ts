import type { Config } from 'jest';

const jestConfig: Config = {
  verbose: true,
  testEnvironment: 'node',
  // transform: {
  //   '^.+\\.[t|j]sx?$': 'jest-esm-transformer',
  // },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    // '^@amnis/core/(.*)$': '<rootDir>/packages/amnis-core/src/$1',
  },
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
    'srv',
    'lib',
    'pkg',
    'dist',
    'web',
    'out',
  ],
  collectCoverage: true,
  coverageReporters: ['json', 'html'],
  extensionsToTreatAsEsm: ['.ts'],
};

export default jestConfig;
