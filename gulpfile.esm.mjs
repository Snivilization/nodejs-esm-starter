
import gulp from 'gulp';
const series = gulp.series;
import del from 'del';
import { outDir, allInput } from './rollup/options.mjs';

import { rollup } from 'rollup';
import * as prodOptions from './rollup.production.mjs'
import * as devOptions from './rollup.development.mjs'

// clean
//
async function cleanTask() {
  return del([`./${outDir}/*.*`]);
}
gulp.task('clean', cleanTask);

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
gulp.task('prod', productionTask);

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
gulp.task('dev', developmentTask);

// watch
//
const watchSequence = series(developmentSourceTask, developmentTestTask);
const beforeWatch = series(cleanTask, watchSequence);

async function watchTask() {
  beforeWatch();
  gulp.watch(allInput, watchSequence);
}
gulp.task('watch', watchTask);

// lint
//
gulp.task('lint', async () => {
  console.log('---> lint tbd ...')
});

gulp.task('default', productionTask);
