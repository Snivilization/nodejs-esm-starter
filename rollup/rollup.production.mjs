
import roptions from "./options.mjs";
import copy from "deep-copy-all";
import multi from "rollup-plugin-multi-entry";
import typescript from "@rollup/plugin-typescript";

// source, we include the uglifier for the production source code
// By default, the output is a singular object. This means that it
// will generate a single output. However, if the user needs to
// generate multiple outputs for the same input, they can do so,
// by setting up the output property as an array of outputs, so
// they can for example generate un-minimised and minimised
// assets for the same input. Each output entity can contain
// output specific plugins.
//
const sourceOutput = copy(roptions.outputs.source);
sourceOutput.plugins = roptions.plugins.production;

const source = {
  input: roptions.inputs.main,
  output: sourceOutput,
  external: roptions.externals.source,
  plugins: [...roptions.plugins.universal, typescript({
    tsconfig: `./${roptions.ts.source.config.filename}`
  })],
  treeshake: roptions.treeshake
};

// test
//
const testOutput = copy(roptions.outputs.test);

const test = {
  input: roptions.inputs.test,
  external: roptions.externals.test,
  output: testOutput,
  plugins: [...roptions.plugins.universal, typescript({
    tsconfig: `./${roptions.ts.test.config.filename}`
  }), multi()],
  treeshake: roptions.treeshake
};

export default { source, test };
