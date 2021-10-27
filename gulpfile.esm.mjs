
import gulp from "gulp";
const series = gulp.series;
import del from "del";
import eslint from "gulp-eslint";
import { rollup } from "rollup";
import copy from "deep-copy-all";

import { outDir, allInput, lintInput } from "./rollup/options.mjs";
import * as prodOptions from "./rollup.production.mjs";
import * as devOptions from "./rollup.development.mjs";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const lintOptions = require("./.eslintrc.json");

// clean
//
async function cleanTask() {
  return del([`./${outDir}/*.*`]);
}
gulp.task("clean", cleanTask);

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

const productionTask = series(
  cleanTask, productionSourceTask, productionTestTask
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

const developmentTask = series(
  cleanTask, developmentSourceTask, developmentTestTask
);
gulp.task("dev", developmentTask);

// watch
//
const watchSequence = series(developmentSourceTask, developmentTestTask);
const beforeWatch = series(cleanTask, watchSequence);

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
  // .pipe(eslint.failAfterError());
}
gulp.task("lint", lintTask);

async function fixTask() {
  const withFix = copy(lintOptions);
  withFix.fix = true;
  gulp.src(lintInput)
    .pipe(eslint(withFix))
    .pipe(eslint.format())
    .pipe(gulp.dest(file => file.base));
  
  // .pipe(eslint.failAfterError());
}
gulp.task("fix", fixTask);

gulp.task("default", productionTask);
