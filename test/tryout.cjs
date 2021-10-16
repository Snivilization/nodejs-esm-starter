const assert = require('assert')
const { banner } = require('nodejs-esm-starter')

assert.strict.match(banner(), /The answer is.*42/)

console.log(banner())
