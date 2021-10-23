
import * as roptions from './rollup/options.mjs';
import copy from 'deep-copy-all';
import multi from "rollup-plugin-multi-entry";
const mode = 'prod';

// source, we include the uglifier for the production source code
// By default, the output is a singular object. This means that it
// will generate a single output. However, if the user needs to
// generate multiple outputs for the same input, they can do so,
// by setting up the output property as an array of outputs, so
// they can for example generate un-minimised and minimised
// assets for the same input. Each output entity can can contain
// output specific plugins.
//
const sourceOutput = copy(roptions.outputOptions);
sourceOutput.file = roptions.bundleName({
  discriminator: `${mode}-src`
});
sourceOutput.plugins = roptions.productionPlugins;

const source = {
  input: roptions.input,
  output: sourceOutput,
  plugins: roptions.universalPlugins,
  treeshake: roptions.treeshake
}

// test
//
const testOutput = copy(roptions.outputOptions);
testOutput.file = roptions.bundleName({
  discriminator: `${mode}-test`
});

const test = {
  input: roptions.testInput,
  external: roptions.external,
  output: testOutput,
  plugins: [...roptions.universalPlugins, multi()],
  treeshake: roptions.treeshake
}

export { source, test }
