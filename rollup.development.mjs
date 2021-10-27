
import * as roptions from "./rollup/options.mjs";
import copy from "deep-copy-all";
import multi from "rollup-plugin-multi-entry";
import typescript from "@rollup/plugin-typescript";
const mode = "dev";

// source
//
const sourceOutput = copy(roptions.outputOptions);
sourceOutput.file = roptions.bundleName({
  discriminator: `${mode}-src`
});

const source = {
  input: roptions.input,
  output: sourceOutput,
  plugins: [...roptions.universalPlugins, typescript({
    tsconfig: `./${roptions.sourceTsConfigFilename}`
  })],
  treeshake: roptions.treeshake
};

// test, just copy from source and override as necessary. If we want to diverge
// away from the source config, then we can do so by copying roptions.outputOptions
// instead of source
//
const test = copy(source);
test.input = roptions.testInput;
test.external = roptions.external;
test.output.file = roptions.bundleName({
  discriminator: `${mode}-test`
});
test.plugins = [...test.plugins, typescript({
  tsconfig: `./${roptions.testTsConfigFilename}`
}), multi()];

export { source, test };
