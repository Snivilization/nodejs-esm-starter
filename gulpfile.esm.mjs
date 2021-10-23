
import gulp from 'gulp';
const series = gulp.series;
import del from 'del';
import { outDir } from './rollup/options.mjs';

import { rollup } from 'rollup';
import * as prodOptions from './rollup.production.mjs'
import * as devOptions from './rollup.development.mjs'

async function cleanTask() {
  return del([`./${outDir}/*.*`]);
}
gulp.task('clean', cleanTask);

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


gulp.task('lint', async () => {
  console.log('---> lint tbd ...')
});

gulp.task('default', productionTask);
