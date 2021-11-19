
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
const main = "./src/main.ts";
const sourceInput = ["src/**/*.ts"];
const testInput = ["test/**/*.spec.ts"];
const allInput = [...sourceInput, ...testInput];
const lintInput = [...allInput, "./*.mjs", "./gulp/*.mjs", __filename];

const inputs = {
  main: main,
  source: sourceInput,
  test: testInput,
  all: allInput,
  lint: lintInput
};

// Output
//
const directories = {
  out: "dist",
  coverage: "coverage"
};

const o = {
  format: "es",
  sourcemap: true
};

function hasProperty(info) {
  return Object.defineProperty.hasOwnProperty.call(info.obj, info.name);
}

function bundleName(options) {
  if (options === null) {
    throw "bundleName: Missing options object";
  }

  const result = (hasProperty({ obj: options, name: "discriminator" })) ?
    `${directories.out}/${name}-${options.discriminator}-bundle.js` :
    `${directories.out}/${name}-bundle.js`;

  return result;
}

const outputs = {
  source: {
    ...o,
    file: bundleName({
      discriminator: "src"
    })
  },
  test: {
    ...o,
    file: bundleName({
      discriminator: "test"
    })
  }
};

// plugins
//
const minify = {
  module: true
};

const plugins = {
  universal: [
    resolve(),
    commonjs()
  ],

  production: [
    terser(minify)
  ]
};

const ts = {
  source: {
    config: {
      filename: "tsconfig.json"
    }
  },
  test: {
    config: {
      filename: "tsconfig.test.json"
    }
  }
};

// note here, we specify name in the external list because we don't want to bundle
// the source into the test bundle.
//
const external = ["chai", "mocha", "dirty-chai", name];
const treeshake = true;

export {
  inputs,
  outputs,
  directories,
  ts,
  plugins,
  external,
  treeshake,
  bundleName
};
