import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';

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
    'bcrypt',
  ],
};

/**
 * ECMAScript Node Module
 * @type {import('rollup').RollupOptions}
 */
rollup.push({
  ...base,
  input: 'src/env.node/index.ts',
  output: {
    file: 'dist/index.node.mjs',
    format: 'esm',
  },
});

/**
 * ECMAScript Browser Module
 * @type {import('rollup').RollupOptions}
 */
rollup.push({
  ...base,
  input: 'src/env.browser/index.ts',
  output: {
    file: 'dist/index.browser.mjs',
    format: 'esm',
  },
});

/**
 * ECMAScript React Module
 * @type {import('rollup').RollupOptions}
 */
rollup.push({
  ...base,
  input: 'src/env.react/index.ts',
  output: {
    file: 'dist/index.react.mjs',
    format: 'esm',
  },
});

/**
 * CommonJS Node
 * @type {import('rollup').RollupOptions}
 */
rollup.push({
  ...base,
  input: 'src/env.node/index.ts',
  output: {
    file: 'dist/index.node.js',
    format: 'cjs',
  },
});

/**
 * CommonJS Browser
 * @type {import('rollup').RollupOptions}
 */
rollup.push({
  ...base,
  input: 'src/env.browser/index.ts',
  output: {
    file: 'dist/index.browser.js',
    format: 'cjs',
  },
});

/**
 * CommonJS React
 * @type {import('rollup').RollupOptions}
 */
rollup.push({
  ...base,
  input: 'src/env.react/index.ts',
  output: {
    file: 'dist/index.react.js',
    format: 'cjs',
  },
});

export default rollup;
