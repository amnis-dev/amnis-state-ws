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
      outputToFilesystem: true,
    }),
  ],
  external: [
    /@amnis\/.*/,
    '@reduxjs/toolkit',
    'node:crypto',
    'bcrypt',
    'jsonwebtoken',
  ],
};

/**
 * ECMAScript Node Module
 * @type {import('rollup').RollupOptions}
 */
rollup.push({
  ...base,
  input: 'src/index.node.ts',
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
  input: 'src/index.browser.ts',
  output: {
    file: 'dist/index.browser.mjs',
    format: 'esm',
  },
});

/**
 * CommonJS Node
 * @type {import('rollup').RollupOptions}
 */
rollup.push({
  ...base,
  input: 'src/index.node.ts',
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
  input: 'src/index.browser.ts',
  output: {
    file: 'dist/index.browser.js',
    format: 'cjs',
  },
});

export default rollup;
