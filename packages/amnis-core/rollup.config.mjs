import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';

/**
 * Rollout options.
 * @type {import('rollup').RollupOptions[]}
 */
const rollup = [];

/**
  * @type {import('rollup').RollupOptions}
  */
const base = {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.mjs',
    format: 'esm',
  },
  plugins: [
    resolve(),
    json(),
    typescript({
      tsconfig: 'tsconfig.build.json',
      outputToFilesystem: true,
      declaration: false,
    }),
  ],
  external: [
    /@amnis\/.*/,
    '@reduxjs/toolkit',
  ],
};

/**
 * ECMAScript Module
 * @type {import('rollup').RollupOptions}
 */
rollup.push({
  ...base,
  input: 'src/index.ts',
  output: {
    file: 'dist/index.mjs',
    format: 'esm',
  },
});

/**
 * ECMAScript Module (Redux Toolkit Wrapper)
 * @type {import('rollup').RollupOptions}
 */
rollup.push({
  ...base,
  input: 'src/rtk.ts',
  output: {
    file: 'dist/rtk.mjs',
    format: 'esm',
  },
});

/**
 * ECMAScript Module (Redux Toolkit Wrapper)
 * @type {import('rollup').RollupOptions}
 */
rollup.push({
  ...base,
  input: 'src/rtkq.ts',
  output: {
    file: 'dist/rtkq.mjs',
    format: 'esm',
  },
});

/**
 * ECMAScript Module (Redux Toolkit Wrapper)
 * @type {import('rollup').RollupOptions}
 */
rollup.push({
  ...base,
  input: 'src/rtkqr.ts',
  output: {
    file: 'dist/rtkqr.mjs',
    format: 'esm',
  },
});

/**
 * CommonJS
 * @type {import('rollup').RollupOptions}
 */
rollup.push({
  ...base,
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
  },
});

export default rollup;
