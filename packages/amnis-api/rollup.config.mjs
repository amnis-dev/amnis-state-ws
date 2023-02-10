import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
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
    commonjs(),
    typescript({
      tsconfig: 'tsconfig.build.json',
      outputToFilesystem: true,
      declaration: false,
    }),
  ],
  external: [
    /@amnis\/.*/,
    'cross-fetch',
    'react',
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
 * ECMAScript Module (React)
 * @type {import('rollup').RollupOptions}
 */
rollup.push({
  ...base,
  input: 'src/index.react.ts',
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
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
  },
});

/**
 * CommonJS Node (React)
 * @type {import('rollup').RollupOptions}
 */
rollup.push({
  ...base,
  input: 'src/index.react.ts',
  output: {
    file: 'dist/index.react.js',
    format: 'cjs',
  },
});

export default rollup;
