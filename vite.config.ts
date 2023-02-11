/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    globals: true,
    testTimeout: 10000,
  },
  resolve: {
    alias: {
      '@amnis/core': './packages/amnis-core/src/index.ts',
      '@amnis/api': './packages/amnis-api/src/index.ts',
      '@amnis/state': './packages/amnis-state/src/index.ts',
      '@amnis/process': './packages/amnis-process/src/index.ts',
    },
  },
});
