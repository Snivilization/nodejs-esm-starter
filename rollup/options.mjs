
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
  file: `${outDir}/${name}-bundle.js`,
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

const external = ["chai", "mocha", "dirty-chai"];

const treeshake = true;

function verifyNamedProperty(info) {
  if (!Object.defineProperty.hasOwnProperty.call(info.obj, info.name)) {
    throw new `${info.context}: object is missing '${info.name}' property`;
  }

  if (info.obj[info.name].length === 0) {
    throw new `${info.context}: object contains empty '${info.name}' property`;
  }
}

function bundleName(options) {
  if (options === null) {
    throw new "bundleName: Missing options object";
  }
  verifyNamedProperty({ context: "bundleName", obj: options, name: "discriminator" });

  return `${outDir}/${name}-${options.discriminator}-bundle.js`;
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
