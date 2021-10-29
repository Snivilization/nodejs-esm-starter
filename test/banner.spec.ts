import { expect, use } from "chai";
import dirtyChai from "dirty-chai";
use(dirtyChai);
// @ts-ignore
import { banner } from 'nodejs-esm-starter'

describe('banner', () => {
  context("given: banner", () => {
    it('should: find the answer', () => {
      const result = banner();
      expect(result).match(/The answer is.*42/);
    });
  })
});
