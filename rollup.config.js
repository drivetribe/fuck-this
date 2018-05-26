import uglify from 'rollup-plugin-uglify';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';

const config = {
  input: 'src/index.js'
};

const umd = Object.assign({}, config, {
  output: {
    file: 'dist/fuck-this.js',
    format: 'umd',
    name: 'fuckThis',
    exports: 'named',
    globals: { react: 'React' }
  },
  plugins: [
    babel({ exclude: 'node_modules/**' }),
    resolve(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
});

const umdProd = Object.assign({}, umd, {
  output: Object.assign({}, umd.output, {
    file: pkg.unpkg
  }),
  plugins: [
    babel({ exclude: 'node_modules/**' }),
    resolve(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    uglify()
  ]
});

const es = Object.assign({}, config, {
  output: {
    file: pkg.module,
    format: 'es',
    exports: 'named'
  },
  plugins: [babel({ exclude: 'node_modules/**' })]
});

const cjs = Object.assign({}, config, {
  output: {
    file: pkg.main,
    format: 'cjs',
    exports: 'named'
  },
  plugins: [babel({ exclude: 'node_modules/**' })]
});

export default [umd, umdProd, es, cjs];
