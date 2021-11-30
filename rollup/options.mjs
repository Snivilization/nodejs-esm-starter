
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
const main = "./src/index.ts";
const sourceInput = ["src/**/*.ts"];
const testInput = ["test/**/*.spec.ts"];
const allInput = [...sourceInput, ...testInput];
const lintInput18 = [...sourceInput];
const lintInput = [...allInput, "./*.mjs", "./gulp/*.mjs", __filename];

const inputs = {
  main: main,
  source: sourceInput,
  test: testInput,
  all: allInput,
  lint: lintInput,
  lint18: lintInput18
};

// Output
//

function hasProperty(info) {
  return Object.defineProperty.hasOwnProperty.call(info.obj, info.name);
}

const directories = {
  out: "dist",
  coverage: "coverage",
  locales: "locales"
};

function bundleName(options) {
  if (options === null) {
    throw "bundleName: Missing options object";
  }

  const result = (hasProperty({ obj: options, name: "discriminator" })) ?
    `${directories.out}/${name}-${options.discriminator}-bundle.js` :
    `${directories.out}/${name}-bundle.js`;

  return result;
}

const o = {
  format: "es",
  sourcemap: true
};

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

const externals = {
  source: ["i18next", "i18next-cli-language-detector", "i18next-fs-backend"],

  // note here, we specify name in the external list because we don't want to bundle
  // the source into the test bundle.
  //
  test: ["chai", "mocha", "dirty-chai", name]
};

const treeshake = true;

// translation
//
const locales = ["en", "en_US"];

export default {
  inputs,
  outputs,
  directories,
  ts,
  plugins,
  locales,
  externals,
  treeshake
};
