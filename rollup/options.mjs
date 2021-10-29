
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import { URL } from "url";
const { name } = require("../package.json");

import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";

const __filename = new URL(import.meta.url).pathname;

// Input
//
const input = "./src/main.ts";
const sourceInput = ["src/**/*.ts"];
const testInput = ["test/**/*.spec.ts"];
const allInput = [...sourceInput, ...testInput];
const lintInput = [...allInput, "./*.mjs", __filename];
const sourceTsConfigFilename = "tsconfig.json";
const testTsConfigFilename = "tsconfig.test.json";

const inputOptions = {
  input: input
};

// Output
//
const outDir = "dist";
const outputOptions = {
  format: "es",
  sourcemap: true
};

// plugins
//
const universalPlugins = [
  resolve(),
  commonjs()
];

const minify = {
  module: true
};

const productionPlugins = [
  terser(minify)
];

// note here, we specify name in the external list because we dont' need to bundle
// the source into the test bundle.
//
const external = ["chai", "mocha", "dirty-chai", name];
const treeshake = true;

function hasProperty(info) {
  return Object.defineProperty.hasOwnProperty.call(info.obj, info.name);
}

function bundleName(options) {
  if (options === null) {
    throw "bundleName: Missing options object";
  }

  const result = (hasProperty({ obj: options, name: "discriminator" })) ?
    `${outDir}/${name}-${options.discriminator}-bundle.js` :
    `${outDir}/${name}-bundle.js`;

  return result;
}

export {
  input,
  sourceInput,
  testInput,
  allInput,
  lintInput,
  inputOptions,
  outputOptions,
  sourceTsConfigFilename,
  testTsConfigFilename,
  outDir,
  universalPlugins,
  productionPlugins,
  external,
  treeshake,
  bundleName
};
