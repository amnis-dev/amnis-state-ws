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
