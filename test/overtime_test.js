"use strict";

var Overtime = require("../src/overtime");

module.exports = {
 setUp: function(done)
 {
  done();
 },
 tearDown: function(done)
 {
  done();
 },
 "creating an instance of overtime": function(test)
 {
  var ot = new Overtime();

  test.expect(1);
  test.ok(ot, "should work without errors.");
  test.done();
 }
};
