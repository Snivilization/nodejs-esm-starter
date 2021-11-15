
import gulp from "gulp";
import del from "del";
import eslint from "gulp-eslint";
import mocha from "gulp-mocha";
import { rollup } from "rollup";
import copy from "deep-copy-all";

import { outDir, allInput, lintInput } from "./rollup/options.mjs";
import * as prodOptions from "./rollup/rollup.production.mjs";
import * as devOptions from "./rollup/rollup.development.mjs";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const lintOptions = require("./.eslintrc.json");
const mochaOptions = require("./.mocharc.json");

// clean
//
async function cleanTask() {
  return del([`${outDir}/**`, `!${outDir}/`]);
}
gulp.task("clean", cleanTask);

// copy resources: just add the resources that need to be copied into
// this array. If non required, then set resourceSpecs to be an empty array.
//
const resourceSpecs = [
  {
    name: "copy text file",
    source: "./src/text.txt",
    destination: "./dist"
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

async function productionMochaTask() {
  await gulp.src(prodOptions.test.output.file)
    .pipe(mocha(mochaOptions));
}
gulp.task("prod-mocha", productionMochaTask);

const productionTask = gulp.series(
  cleanTask,
  productionSourceTask,
  productionTestTask,
  copyResourcesTask,
  productionMochaTask
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

async function developmentMochaTask() {
  await gulp.src(devOptions.test.output.file)
    .pipe(mocha(mochaOptions));
}
gulp.task("dev-mocha", developmentMochaTask);

const developmentTask = gulp.series(
  cleanTask,
  developmentSourceTask,
  developmentTestTask,
  copyResourcesTask,
  developmentMochaTask
);
gulp.task("dev", developmentTask);

// watch
//
const watchSequence = gulp.series(developmentSourceTask, developmentTestTask);
const beforeWatch = gulp.series(cleanTask, watchSequence);

async function watchTask() {
  beforeWatch();
  gulp.watch(allInput, watchSequence);
}
gulp.task("watch", watchTask);

// lint
//
async function lintTask() {
  gulp.src(lintInput)
    .pipe(eslint(lintOptions))
    .pipe(eslint.format());
}
gulp.task("lint", lintTask);

async function fixTask() {
  const withFix = copy(lintOptions);
  withFix.fix = true;
  gulp.src(lintInput)
    .pipe(eslint(withFix))
    .pipe(eslint.format())
    .pipe(gulp.dest(file => file.base));
}
gulp.task("fix", fixTask);

gulp.task("default", productionTask);
