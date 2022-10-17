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
      declaration: true,
    }),
  ],
  external: ['@reduxjs/toolkit'],
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

/**
 * Universal Module Definition
 * @type {import('rollup').RollupOptions}
 */
rollup.push({
  ...base,
  input: 'src/index.ts',
  output: {
    name: 'amnisCore',
    file: 'dist/index.umd.js',
    format: 'umd',
  },
});

export default rollup;
