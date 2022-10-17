import resolve from '@rollup/plugin-node-resolve';
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
    typescript({
      tsconfig: 'tsconfig.build.json',
    }),
  ],
  external: ['@reduxjs/toolkit'],
};

/**
 * ESM Node
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
 * ESM Browser
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
 * ESM React
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

/**
 * UMD
 * @type {import('rollup').RollupOptions}
 */
rollup.push({
  ...base,
  input: 'src/index.ts',
  output: {
    file: 'dist/index.umd.js',
    format: 'umd',
  },
});

export default rollup;
