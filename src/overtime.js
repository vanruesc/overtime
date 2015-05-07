"use strict";

/**
 * The Overtime Class.
 */

function Overtime()
{
 this.ctx = null;
}

/**
 * Getter for the internal canvas.
 */

Object.defineProperty(Overtime.prototype, "canvas",
{
 get: function() { return this.ctx.canvas; },
 set: function(c) { this.ctx = c.getContext("2d"); }
});

// Reveal public members.
module.exports = Overtime;
