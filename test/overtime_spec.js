"use strict";

/**
 * Jasmine specs.
 */

var Overtime = require("../src/overtime");

describe("Overtime", function()
{
 var ot;

 it("should be a constructor function", function()
 {
  expect(typeof Overtime).toBe("function");
  ot = new Overtime();
  expect(typeof ot).toBe("object");
 });

 it("should have a canvas", function()
 {
  expect(typeof ot.canvas).toBe("object");
 });
});
