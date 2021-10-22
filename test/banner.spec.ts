import { expect, use } from 'chai'
// import dirtyChai = require('dirty-chai')
import dirtyChai from 'dirty-chai'
// import 'mocha'
use(dirtyChai) // webpack figures out the import suffix: ;

describe('blah', () => {
  context('given: something', () => {
    it('should: get the magic number', () => {
      console.log('---> not yet implmented')
    })
  })
})


/*
import assert from 'assert'
import { banner } from 'nodejs-esm-starter'

assert.strict.match(banner(), /The answer is.*42/)

console.log(banner())
*/
