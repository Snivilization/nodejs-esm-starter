import { expect, use } from "chai";
import dirtyChai from "dirty-chai";
// @ts-ignore
import { add } from 'nodejs-esm-starter'

use(dirtyChai);

describe("dummy", () => {
  context("given: something", () => {
    it("should: do somthing else", () => {
      const result = add(1, 2);
      expect(result).equal(3);
    });
  });
});
