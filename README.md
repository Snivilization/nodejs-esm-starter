# :airplane: nodejs-esm-starter

___Starter project for NodeJs esm packages, with [rollup](https://rollupjs.org), [typescript](https://www.typescriptlang.org/), [mocha](https://mochajs.org/), [chai](https://www.chaijs.com/), [eslint](https://eslint.org/), [istanbul/nyc](https://istanbul.js.org/), [gulp](https://gulpjs.com/), [i18next](https://www.i18next.com/)___

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/standard/semistandard)
[![typescript](https://img.shields.io/badge/TypeScript-007ACC?flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

:crown: This starter was created from the information gleaned from the excellent suite of articles written by 'Gil Tayar': [Using ES Modules (ESM) in Node.js: A Practical Guide (Part 1)](https://gils-blog.tayar.org/posts/using-jsm-esm-in-nodejs-a-practical-guide-part-1/), which I would highly recommend to anyone wishing to get a full understanding of ESM modules with NodeJS and provides the full picture lacking in other offical documentation sources/blogs. The following description contains links into the relevant parts of Gil Tayar's blog series.

## :gift: package.json features

### :gem: ESM module

```json
  "type": "module",
```

:mortar_board: See: [Using the .js extension for ESM](https://gils-blog.tayar.org/posts/using-jsm-esm-in-nodejs-a-practical-guide-part-1/#using-the-.js-extension-for-esm)

This entry makes the packaage an __esm__ module and means that we don't have to use the .mjs extension to indicate a module is __esm__; doing so causes problems with some tooling.

### :gem: The 'exports' field

```json
  "exports": {
    ".": "./src/main.js"
  },
```

:mortar_board: See: [The 'exports' field](https://gils-blog.tayar.org/posts/using-jsm-esm-in-nodejs-a-practical-guide-part-2/#the-exports-field)

The correct way to define a package's entry point in __esm__ is to specify the __exports__ field and it must start with a '.' as illustrated.

Using the __exports__ field prevents deep linking into the package; we're are restricted to using the entry points defined in __exports__ only.

#### :sparkles: Self referencing

```json
  "exports": {
    ".": "./src/main.js",
    "./package.json": "./package.json"
  },
```

:mortar_board: See: [Self referencing](https://gils-blog.tayar.org/posts/using-jsm-esm-in-nodejs-a-practical-guide-part-2/#self-referencing-the-package)

This means we can use the name of the package on an import instead of a relative path, so a unit test could import like so:

```js
import {banner} from 'nodejs-esm-starter'
```

However, there is still an issue with _self referencing_ like this. typescript will appear not be able to resolve that the package name, but in reality there is no problem. Therefore, we need to disable the resultant error. This is achieved at the import site with a typescript directive as illustarted below:

```js
// @ts-ignore
import {banner} from 'nodejs-esm-starter'
```

But that now throws up another issue. What we find now is that when we go to lint the project (just run `npm run lint`), we'll simply be served up an error message of the form:

> 4:1  error  Do not use "@ts-ignore" because it alters compilation errors  @typescript-eslint/ban-ts-comment

It is safe to disable this and we do so by turning off the _ban-ts-comment_ rule in the _.eslintrc.json_ config file inside the "rules" entry:

```json
"@typescript-eslint/ban-ts-comment": "off",
```

#### :sparkles: Multiple exports

This starter does not come with multiple exports; it would be up to the client package to define as required, but would look something like:

```json
  "exports": {
    ".": "./src/main.js",
    "./red": "./src/main-red.js",
    "./blue": "./src/main-blue.js",
    "./package.json": "./package.json"
  },
```

:mortar_board: See: [Multiple exports](https://gils-blog.tayar.org/posts/using-jsm-esm-in-nodejs-a-practical-guide-part-2/#multiple-exports)


#### :sparkles: Dual-mode libraries

This allows the module to be __required__ synchronously by other commonjs packages or __imported__ asynchronously by __esm__ packages. This requires transpilation which we achieve by using ___rollup___.

The '.' entry inside exports is what gives us this dual mode capability:

```json
  "exports": {
    ".": {
      "require": "./lib/main.cjs",
      "import": "./src/main.js"
    },
```

:mortar_board: See: [Dual-mode libraries](https://gils-blog.tayar.org/posts/using-jsm-esm-in-nodejs-a-practical-guide-part-2/#dual-mode-libraries)

NB: we write our __rollup__ config in a .mjs file because rollup assumes .js is commonjs, so we are forced to use .mjs, regardless of the fact that our package has been marked as __esm__ via the package.json __type__ property.

##### :page_with_curl: The 'files' entry

```json
  "files": [
    "src",
    "lib"
  ],
```

:mortar_board: See: [Transpiling with Rollup](https://gils-blog.tayar.org/posts/using-jsm-esm-in-nodejs-a-practical-guide-part-2/#transpiling-esm-to-cjs-using-rollup)

Required for dual-mode package.

## :open_file_folder: Boilerplate project structure

All _rollup_ related funcitonality is contained within the rollup folder. Currently, there is a separate file for development and production. The main difference between the production and development rollup configs is that for the former, we use the terser plugin to mangle the generated javascript bundle.

### :books: options/production/development

The setup is structured to keep the gulp config encapulated away from the rollup config. This means that the user can discard gulp if they so wish to without it affecting the rollup. The flow of data goes from the root, that being ___rollup/options.mjs___, to either ___rollup.development.mjs___ or ___rollup.production.mjs___ dependending on the current _mode_ which is then finally imported into the gulp file ___gulpfile.esm.mjs___.

It is intended that the user should specify all generic settings in the options.mjs file and export them from there. This way, we can ensure that any properties are defined in a single place only and inherited as required. Clearly, production specific settings should go in the production file and like-wise for development.

### :beers: gulp file (gulpfile.esm.mjs)

In order to simplify usage of gulp in the presence of the alternative gulfile name being ___gulpfile.esm.mjs___ (as opposed to the default of simply being ___gulpfile.mjs___), a symbolic link has been defined from ___gulpfile.mjs___ to ___gulpfile.esm.mjs___. This means that the user can run gulp commands without having to explicitly define the gulp file ___gulpfile.esm.mjs___.

#### :heavy_plus_sign: Copying resources

The gulp file, contains an array definition __resourceSpecs__. By default it contains a single dummy entry that illustrates how to define resource(s) to be copied into the output folder. Each entry in the array should be an object eg:

```js
  {
    name: "copy text file",
    source: "./src/text.txt",
    destination: `./${outDir}`
  }
```

A _copyTask_ is defined composed from a series of tasks defined by __resourceSpecs__. If no resources are to be copied, then just remove this default entry and leave the array to be empty.

## :rocket: Using this template

After the client project has been created from this template, a number of changes need to be made and are listed as follows:

+ Update the `name` property inside package.json. Initially it will be set to _nodejs-esm-starter_. The user should perform a global search and replace inside package.js as there are other entries derived from this name. Ideally, there would be a way in json to be able to cross reference fields, but alas, this is not currently possible. The dummy unit tests also import the template project name, so these will have to be updated to use the real package name other wise the tests will fail due to an incorrect import.
+ add a __.env__ file to the root of the project. This will be used to store secrets when the time comes for performing a release. Initially, the user can simply set the contents to:

> GH_TOKEN=ADD-KEY-HERE

This can be taken literally, ie if you don't yet have a personal access token, then set it here to a dummy value
+ define resources to copy, if any.
+ remove the dummy tests and source dode.
+ ... and then of course, customise the configs as required.

## :globe_with_meridians: i18next Translation ready

This template comes complete with the initial boilerplate required for integration with [i18next](https://www.i18next.com/). It has been set up with English UK (en) set as the default alongside English US (en-US). If so required, this setup can easily be changed and more languages added as appropriate.

If translation is not required, then it can be removed (dependencies: [i18next](https://www.npmjs.com/package/i18next) and [i18next-fs-backend](https://www.npmjs.com/package/i18next-fs-backend)) but it is highly recommended to leave it in. i18next can help in writing cleaner code. The biggest issue for users just starting with i18next is getting used to the idea that string literals should now never be used (see exceptions documented for the [eslint-plugin-i18next](https://www.npmjs.com/package/eslint-plugin-i18next) plugin) and this will be made evident by the linting process; in particular, the user is likely to see violations of the [i18next/no-literal-string](https://github.com/edvardchen/eslint-plugin-i18next#rule-no-literal-string) rule.

The __lint__ gulp task will flag up translation violations and another gulp task __i18next__ has been implemented using [i18next-parser](https://www.npmjs.com/package/i18next-parser), which helps with the process of maintaining translations as the code base evoles.

The __i18next/no-literal-string__ should really only be applied to user facing text content. For this reason, the project has been setup to only apply the rule to typescript files inside the "src" directory and not to unit tests, which would have become too onerous to manage.

## :robot: Automated releases

Releases have been automated using gulp's [Automate Releases recipe](https://gulpjs.com/docs/en/recipes/automate-releases/). However, this is just an initial setup. The user should become accustomed with the following concepts:

+ keeping a clean commit history with [conventional commits](https://www.conventionalcommits.org)
+ npm [version](https://docs.npmjs.com/cli/v8/commands/npm-version) command. But there is a caveat here. Conventional recommends not using npm version, but to use standard version instead (which is part of conventional-changelog).
+ automatic version number bumping [Conventional Recommended Bump](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-recommended-bump#readme)
+ using [conventional-changelog-cli](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-cli#readme) to generate a changelog from git metadata
+ Make a new GitHub release from git metadata with [conventional changelog](https://github.com/conventional-changelog/conventional-changelog)

To run the full release, just run `npm run release`. Two methods have been defined for completing an automated release, see the following:

:pushpin: __Gulp:__ this recipe recipe generates and publishes releases (including version number bumping, change log generation and tagging) to gihub. In it's current form, it does not publish to the npm registry, so the user will have to add this to the release chain. The gulp release has been defined as a script named "_gulp:rel"

:pushpin: __[standard version:](https://github.com/conventional-changelog/standard-version)__ this is an alternative to what has been defined in the release gulp task and has been defined in package.json denoted by a script entry named "_standard:rel".

By default, `release` has been set to use "standard", but this can be switched to use the "gulp" version instead.

It should also be noted that there is a third way (not implemented mentioned here for reference), which is to use [semantic release](https://semantic-release.gitbook.io/semantic-release/).

## :construction: Required dev depenencies of note

+ :hammer: dual mode package [rollup](https://www.rollupjs.org) ([npm](https://www.npmjs.com/package/rollup))
+ :hammer: platform independent copy of non js assets [cpr](https://github.com/davglass/cpr) ([npm](https://www.npmjs.com/package/cpr))
+ :hammer: merge json objects (used to derive test rollup config from the source config) [deepmerge](https://github.com/TehShrike/deepmerge) ([npm](https://www.npmjs.com/package/deepmerge))
+ :hammer: type definitions for [file system backend (npm)](https://www.npmjs.com/package/i18next-fs-backend) @types/i18next-fs-backend
+ :hammer: eslint plugin ([npm](https://www.npmjs.com/package/eslint-plugin-i18next))
+ :hammer: i18next-parser ([npm](https://www.npmjs.com/package/i18next-parser))

## :warning: A note about 'vulnerablities' in dev dependencies

An [issue](https://github.com/Snivilization/nodejs-esm-starter/issues/17) was raised to try and resolve the problem of _npm audit_ reporting so called vulnerabilities (mostly relating to gulp dependencies). However, after a lot of head scratching and many failed attempts to resolve, it was discovered that there is a design flaw with _npm audit_. This is a widely known issue and very well documented at a blog post [npm audit: Broken by Design](https://overreacted.io/npm-audit-broken-by-design/). It is for the reasons documented here, that there is no need to attempt to resolve these issues. A custom _audit_ package.json script entry has been defined that specifies the __--production__ flag, (just run `npm run audit`).

## :checkered_flag: Other external resources

Here's a list of other links that were consulted duration the creation of this starter template

+ [Typescript, NodeJS and ES6/ESM Modules](https://dev.to/asteinarson/typescript-nodejs-and-es6-esm-modules-18ea)
+ [How to Setup a TypeScript project using Rollup.js by Luis Aviles](https://www.thisdot.co/blog/how-to-setup-a-typescript-project-using-rollup-js)
+ [Converting a Webpack Build to Rollup](https://shipshape.io/blog/converting-a-webpack-build-to-rollup/)
+ [How to Create a Hybrid NPM Module for ESM and CommonJS](https://www.sensedeep.com/blog/posts/2021/how-to-create-single-source-npm-module.html)
+ [Gulp for Beginners (although this is a bit old - circa 2015)](https://css-tricks.com/gulp-for-beginners/)

:tv: Youtube:

+ [Full beginner Gulp setup for SCSS, minifying Javascript, and minifying/webp images](https://www.youtube.com/watch?v=ubHwScDfRQA&t=2s)
