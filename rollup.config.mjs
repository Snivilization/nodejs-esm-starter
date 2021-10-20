
import { terser } from 'rollup-plugin-terser';

// Can't easily import json yet inside esm so we have to go round the houses
//
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pkg = require("./package.json");

const minify = {
  module: true
}

export default {
  input: './out-tsc/main.js',
  output: {
    "format": "es",
    file: `dist/${pkg.name}-bundle.js`,
    "plugins": [terser(minify)],
    sourcemap: true
  },
  plugins: [],
  treeshake: true
}
