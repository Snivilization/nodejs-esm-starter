
import roptions from "./options.mjs";
import copy from "deep-copy-all";
import multi from "rollup-plugin-multi-entry";
import typescript from "@rollup/plugin-typescript";

// source
//
const source = {
  input: roptions.inputs.main,
  output: roptions.outputs.source,
  external: roptions.externals.source,
  plugins: [...roptions.plugins.universal, typescript({
    tsconfig: `./${roptions.ts.source.config.filename}`
  })],
  treeshake: roptions.treeshake
};

// test, just copy from source and override as necessary. If we want to diverge
// away from the source config, then we can do so by copying roptions.outputs.test
// instead of source
//
const test = copy(source);
test.input = roptions.inputs.test;
test.output = roptions.outputs.test;
test.external = roptions.externals.test;

test.plugins = [...test.plugins, typescript({
  tsconfig: `./${roptions.ts.test.config.filename}`
}), multi()];

export default { source, test };
