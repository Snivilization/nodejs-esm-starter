
import gulp from "gulp";
import del from "del";
import eslint from "gulp-eslint";
import mocha from "gulp-mocha";
import { rollup } from "rollup";
import copy from "deep-copy-all";

import * as roptions from "./rollup/options.mjs";
import * as prodOptions from "./rollup/rollup.production.mjs";
import * as devOptions from "./rollup/rollup.development.mjs";
import * as release from "./gulp/release.mjs";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const lintOptions = require("./.eslintrc.json");
const mochaOptions = require("./.mocharc.json");

// clean
//
async function cleanTask() {
  return del([
    `${roptions.directories.out}/**`, `!${roptions.directories.out}/`,
    `${roptions.directories.coverage}/**`, `!${roptions.directories.coverage}/`
  ]);
}
gulp.task("clean", cleanTask);

// copy resources: just add the resources that need to be copied into
// this array. If non required, then set resourceSpecs to be an empty array.
//
const resourceSpecs = [
  {
    name: "copy text file",
    source: "./src/text.txt",
    destination: `./${roptions.directories.out}`
  }
];

const resources = resourceSpecs.reduce((acc, spec) => {

  const copyTask = () => {
    return gulp.src(spec.source)
      .pipe(gulp.dest(spec.destination));
  };
  acc.push(copyTask);

  return acc;
}, []);

const copyResourcesTask = gulp.series(...resources);

// test
//
async function mochaTask() {
  await gulp.src(roptions.outputs.test.file)
    .on("error", (err) => {
      console.log(`*** test bundle: '${roptions.testOutputOptions.file}' missing; please build first!`);
      console.log(`${err}`);
    })
    .pipe(mocha(mochaOptions));
}
gulp.task("mocha", mochaTask);

// production
//
async function productionSourceTask() {
  const bundle = await rollup(prodOptions.source);
  await bundle.write(prodOptions.source.output);
}

async function productionTestTask() {
  const bundle = await rollup(prodOptions.test);
  await bundle.write(prodOptions.test.output);
}

const productionBuildTask = gulp.series(
  cleanTask,
  productionSourceTask,
  productionTestTask,
  copyResourcesTask
);
gulp.task("build-prod", productionBuildTask);

const productionTask = gulp.series(
  productionBuildTask,
  mochaTask
);
gulp.task("prod", productionTask);

// development
//
async function developmentSourceTask() {
  const bundle = await rollup(devOptions.source);
  await bundle.write(devOptions.source.output);
}

async function developmentTestTask() {
  const bundle = await rollup(devOptions.test);
  await bundle.write(devOptions.test.output);
}

const developmentBuildTask = gulp.series(
  cleanTask,
  developmentSourceTask,
  developmentTestTask,
  copyResourcesTask
);
gulp.task("build-dev", developmentBuildTask);

const developmentTask = gulp.series(
  developmentBuildTask,
  mochaTask
);
gulp.task("dev", developmentTask);

// watch
//
const watchSequence = gulp.series(developmentSourceTask, developmentTestTask);
const beforeWatch = gulp.series(cleanTask, watchSequence);

async function watchTask() {
  beforeWatch();
  gulp.watch(roptions.inputs.all, watchSequence);
}
gulp.task("watch", watchTask);

// lint
//
async function lintTask() {
  gulp.src(roptions.inputs.lint)
    .pipe(eslint(lintOptions))
    .pipe(eslint.format());
}
gulp.task("lint", lintTask);

async function fixTask() {
  const withFix = copy(lintOptions);
  withFix.fix = true;
  gulp.src(roptions.inputs.lint)
    .pipe(eslint(withFix))
    .pipe(eslint.format())
    .pipe(gulp.dest(file => file.base));
}
gulp.task("fix", fixTask);

// release
//
const releaseTask = gulp.series(
  release.bumpVersion,
  release.changelog,
  release.commitTagPush,
  release.githubRelease
);
gulp.task("release", releaseTask);

// default
//
gulp.task("default", productionTask);
