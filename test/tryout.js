import assert from 'assert'
import { banner } from 'nodejs-esm-starter'

assert.strict.match(banner(), /The answer is.*42/)

console.log(banner())
