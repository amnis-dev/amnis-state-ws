import typescript from '@rollup/plugin-typescript';

/**
 * @type {import('rollup').RollupOptions}
 */
const configNodeEsm = {
  input: 'src/index.node.ts',
  output: {
    file: 'dist/index.node.mjs',
    format: 'esm',
  },
  plugins: [typescript({
    tsconfig: 'tsconfig.build.json',
  })],
};

/**
 * @type {import('rollup').RollupOptions}
 */
const configBrowserEsm = {
  input: 'src/index.browser.ts',
  output: {
    file: 'dist/index.browser.mjs',
    format: 'esm',
  },
  plugins: [typescript({
    tsconfig: 'tsconfig.build.json',
  })],
};

/**
 * @type {import('rollup').RollupOptions}
 */
const configReactEsm = {
  input: 'src/index.react.ts',
  output: {
    file: 'dist/index.react.mjs',
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

export default [configNodeEsm, configBrowserEsm, configReactEsm, configCjs, configUmd];
