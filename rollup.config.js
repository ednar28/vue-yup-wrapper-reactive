import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';
import pkg from './package.json' with { type: 'json' };

const isProduction = process.env.NODE_ENV === 'production';

export default [{
  // JavaScript build
  input: 'src/index.ts',
  external: ['vue', 'yup'],
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      exports: 'named',
      sourcemap: true
    }
  ],
  plugins: [
    nodeResolve({
      preferBuiltins: false
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: false,
      rootDir: './src'
    }),
    isProduction && terser()
  ].filter(Boolean)
}, {
  // TypeScript declarations build
  input: 'src/index.ts',
  external: ['vue', 'yup'],
  output: {
    file: pkg.types,
    format: 'es'
  },
  plugins: [dts()]
}];