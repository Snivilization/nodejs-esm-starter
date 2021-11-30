
import gulp from "gulp";
import del from "del";
import eslint from "gulp-eslint";
import mocha from "gulp-mocha";
import { rollup } from "rollup";
import copy from "deep-copy-all";

import roptions from "./rollup/options.mjs";
import poptions from "./rollup/rollup.production.mjs";
import doptions from "./rollup/rollup.development.mjs";
import release from "./gulp/release.mjs";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const lintOptions = require("./.eslintrc.json");
const mochaOptions = require("./.mocharc.json");

import i18nextParser from "i18next-parser";
const i18nChecker = i18nextParser.gulp;

// i18next translation
//
const i18nOptions = {
  // see https://github.com/i18next/i18next-parser for options list
  //
  locales: roptions.locales,
  output: `${roptions.directories.locales}/$LOCALE/$NAMESPACE.json`
};

async function translationCheckTask() {
  await gulp.src(roptions.inputs.source)
    .pipe(new i18nChecker(i18nOptions))
    .pipe(gulp.dest("./"));
}
gulp.task("i18next", translationCheckTask);

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
    name: "copy locales",
    source: "./locales/**/*.*",
    destination: `./${roptions.directories.out}/locales/`
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
  const bundle = await rollup(poptions.source);
  await bundle.write(poptions.source.output);
}

async function productionTestTask() {
  const bundle = await rollup(poptions.test);
  await bundle.write(poptions.test.output);
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
  const bundle = await rollup(doptions.source);
  await bundle.write(doptions.source.output);
}

async function developmentTestTask() {
  const bundle = await rollup(doptions.test);
  await bundle.write(doptions.test.output);
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

// incremental development only test
//
async function cleanTestBundle() {
  return del([
    `${roptions.directories.out}/${roptions.outputs.test.file}`
  ]);
}
const retestTask = gulp.series(
  cleanTestBundle,
  developmentTestTask,
  mochaTask
);
gulp.task("retest", retestTask)

// watch
//
const watchSequence = gulp.series(developmentSourceTask, developmentTestTask);
const beforeWatch = gulp.series(cleanTask, watchSequence);

async function watchTask() {
  beforeWatch();
  gulp.watch(roptions.inputs.all, watchSequence);
}
gulp.task("watch", watchTask);

const ESL_DIRECTIVES = {
  rules: {
    names: {
      "no-literal": "i18next/no-literal-string"
    },
    active: {
      "off": 0,
      "warn": 1,
      "error": 2
    }
  }
};

// lint core
//
const lintOptionsCore = copy(lintOptions);
lintOptionsCore.rules[ESL_DIRECTIVES.rules.names["no-literal"]] = ESL_DIRECTIVES.rules.active["off"];

async function lintTaskCore() {
  gulp.src(roptions.inputs.lint)
    .pipe(eslint(lintOptionsCore))
    .pipe(eslint.format());
}

async function fixTaskCore() {
  const withFix = copy(lintOptionsCore);
  withFix.fix = true;
  gulp.src(roptions.inputs.lint)
    .pipe(eslint(withFix))
    .pipe(eslint.format())
    .pipe(gulp.dest(file => file.base));
}

// lint i18next
//
const lintOptions18 = copy(lintOptions);
lintOptions18.rules[ESL_DIRECTIVES.rules.names["no-literal"]] = ESL_DIRECTIVES.rules.active["error"];

async function lintTask18() {
  gulp.src(roptions.inputs.lint18)
    .pipe(eslint(lintOptions18))
    .pipe(eslint.format());
}

async function fixTask18() {
  const withFix18 = copy(lintOptions18);
  withFix18.fix = true;
  gulp.src(roptions.inputs.lint18)
    .pipe(eslint(withFix18))
    .pipe(eslint.format())
    .pipe(gulp.dest(file => file.base));
}

// lint sequences
//
const lintSequence = gulp.series(lintTaskCore, lintTask18);
gulp.task("lint", lintSequence);

const fixSequence = gulp.series(fixTaskCore, fixTask18);
gulp.task("fix", fixSequence);

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
