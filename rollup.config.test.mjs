
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { name } = require("./package.json");

import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

import merge from "deepmerge";
import sourceConfig from "./rollup.config.mjs";
import entry from "rollup-plugin-multi-entry";

import esformatter from "rollup-plugin-esformatter";

const testConfig = {
  input: ["test/**/*.spec.ts"],
  external: ["chai", "mocha", "dirty-chai"],
  output: {
    format: "es",
    file: `dist/${name}-bundle.test.js`,
    plugins: [],
    sourcemap: true
  },
  plugins: [
    entry(),
    resolve(),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.test.json"
    }),
    esformatter({
      indent: {
        value: "  "
      }
    })
  ],
};

// Inherit and override the source rollupp config
//
export default merge(sourceConfig, testConfig);
