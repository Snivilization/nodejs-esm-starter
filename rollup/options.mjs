
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { name } = require("../package.json");

import typescript from "@rollup/plugin-typescript";
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

// Input
//
const input = './src/main.ts';
const testInput = ['test/**/*.spec.ts'];

const inputOptions = {
  input: input
}

// Output
//
const outDir = 'dist';
const outputOptions = {
  format: "es",
  file: `${outDir}/${name}-bundle.js`,
  sourcemap: true
}

// plugins
//
const universalPlugins = [
  resolve(),
  commonjs(),
  typescript({
    tsconfig: "./tsconfig.json"
  })];

const minify = {
  module: true
}

const productionPlugins = [
  terser(minify)
]

const external = ["chai", "mocha", "dirty-chai"];

const lintPlugins = [

]

const treeshake = true;

function verifyNamedProperty(info) {
  if (!info.obj.hasOwnProperty(info.name)) {
    throw new `${info.context}: object is missing '${info.name}' property`;
  }

  if (info.obj[info.name].length === 0) {
    throw new `${info.context}: object contains empty '${info.name}'' property`;
  }
}

function bundleName(options) {
  if (options === null) {
    throw new "bundleName: Missing options object"
  }
  verifyNamedProperty({ context: "bundleName", obj: options, name: "discriminator" });

  return `${outDir}/${name}-${options.discriminator}-bundle.js`
}

export {
  input,
  testInput,
  inputOptions,
  outputOptions,
  outDir,
  universalPlugins,
  productionPlugins,
  external,
  lintPlugins,
  treeshake,
  bundleName
}

