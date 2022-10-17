import typescript from '@rollup/plugin-typescript';

/**
 * @type {import('rollup').RollupOptions}
 */
const configEsm = {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.mjs',
    format: 'esm',
  },
  plugins: [typescript({
    tsconfig: 'tsconfig.build.json',
  })],
};

/**
 * @type {import('rollup').RollupOptions}
 */
const configCjs = {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
  },
  plugins: [typescript({
    tsconfig: 'tsconfig.build.json',
  })],
};

/**
 * @type {import('rollup').RollupOptions}
 */
const configUmd = {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.umd.js',
    format: 'umd',
  },
  plugins: [typescript({
    tsconfig: 'tsconfig.build.json',
  })],
};

export default [configEsm, configCjs, configUmd];
