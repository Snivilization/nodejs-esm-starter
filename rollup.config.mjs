
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { name } = require("./package.json");

import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

import { terser } from "rollup-plugin-terser";

const minify = {
  module: true
};

export default {
  input: "./src/main.ts",
  output: {
    format: "es",
    file: `dist/${name}-bundle.js`,
    plugins: [
      terser(minify)
    ],
    sourcemap: true
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.json"
    })],
  treeshake: true
};
