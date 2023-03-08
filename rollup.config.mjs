import typescript from 'rollup-plugin-typescript2';
import { babel } from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import del from 'rollup-plugin-delete';
import copy from 'rollup-plugin-copy';

// esbuild rollup-plugin-esbuild
// esBuild()

/**
 * @type {import('rollup').RollupOptions}
 */
export default {
  input: 'src/ls.ts',
  output: [
    {
      name: 'ls',
      file: 'dist/index.umd.js',
      format: 'umd',
    },
    {
      name: 'ls',
      file: 'dist/index.esm.js',
      format: 'esm',
    },
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
    }),
    terser(),
    typescript({
      tsconfigOverride: {
        compilerOptions: {},
      },
    }),
    copy({ targets: [{ src: 'src/ls.d.ts', dest: 'dist' }] }),
    del({ targets: 'dist/*' }),
  ],
  external: [],
};
