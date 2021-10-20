# nodejs-esm-starter

:warning: STILL UNDER CONSTRUCTION

___Starter project for NodeJs esm packages, with [rollup](https://rollupjs.org), [typescript](https://www.typescriptlang.org/), [mocha](https://mochajs.org/), [chai](https://www.chaijs.com/), [eslint](https://eslint.org/), [istanbul/nyc](https://istanbul.js.org/), [gulp](https://gulpjs.com/)___

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/standard/semistandard)
[![typescript](https://img.shields.io/badge/TypeScript-007ACC?flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

:crown: This starter was created from the information gleaned from the excellent suite of articles written by 'Gil Tayar': [Using ES Modules (ESM) in Node.js: A Practical Guide (Part 1)](https://gils-blog.tayar.org/posts/using-jsm-esm-in-nodejs-a-practical-guide-part-1/), which I would highly recommend to anyone wishing to get a full understanding of ESM modules with NodeJS and provides the full picture lacking in other offical documentation sources/blogs.

## :gift: package.json features

### :gem: ESM module

```json
  "type": "module",
```

:mortar_board: See: [Using the .js extension for ESM](https://gils-blog.tayar.org/posts/using-jsm-esm-in-nodejs-a-practical-guide-part-1/#using-the-.js-extension-for-esm)

This entry makes the packaage an __esm__ module and means that we don't have to use the .mjs extension to indicate a module is __esm__; doing so causes problems with some tooling.

TODO: investigate using the [__esm__](https://github.com/standard-things/esm) module to provide dual-mode setup.

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

#### :sparkles: Multiple exports

This starter does not come with multiple exports; it would be up to the real packae to define as required, but would look something like:

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

NB: we write our __rollup__ config in a .mjs file because rollup assumes .js is commonjs, so we are forced to use .mjs, regardless of the fact that our package has benn marked as __esm__ via the package.json __type__ property.

##### 'files' entry

```json
  "files": [
    "src",
    "lib"
  ],
```

:mortar_board: See: [Transpiling with Rollup](https://gils-blog.tayar.org/posts/using-jsm-esm-in-nodejs-a-practical-guide-part-2/#transpiling-esm-to-cjs-using-rollup)

Required for dual-mode package.

## Required dev depenencies

+ :hammer: dual mode package [rollup](https://www.rollupjs.org) ([npm](https://www.npmjs.com/package/rollup))
+ :hammer: platform independent copy of non js assets [cpr](https://github.com/davglass/cpr) ([npm](https://www.npmjs.com/package/cpr))
+ :hammer: merge json objects (used to derive test rollup config from the source config) [deepmerge](https://github.com/TehShrike/deepmerge) ([npm](https://www.npmjs.com/package/deepmerge))

## Other external resources

Here's a list of other links that were consulted duration the creation of this starter template

+ [Typescript, NodeJS and ES6/ESM Modules](https://dev.to/asteinarson/typescript-nodejs-and-es6-esm-modules-18ea)

