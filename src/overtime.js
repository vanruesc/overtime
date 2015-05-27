"use strict";

var EventDispatcher = require("./eventdispatcher");

/**
 * Overtime.
 * A time limit visualization library.
 *
 * @param {Object} options - The settings.
 * @param {number} options.time - The time limit.
 * @param {Overtime.TimeMeasure} [options.timeMeasure] - The time measure of the supplied time limit. Falls back to seconds.
 * @param {HTMLElement} [options.container] - The container to place the canvas in. If not supplied, no canvas will be created.
 */

function Overtime(options)
{
 var canvas;

 EventDispatcher.call(this);

 this.TWO_PI = Math.PI * 2.0;
 this.HALF_PI = Math.PI * 0.5;
 this.startAngle = -this.HALF_PI;
 this.ctx = null;
 this.animId = 0;
 this.now = Date.now();
 this.then = this.now;

 this.tm = Overtime.TimeMeasure.MILLISECONDS;
 this.t = 0;

 if(options !== undefined)
 {
  if(typeof options.timeMeasure === "number") { this.tm = options.timeMeasure; }
  if(typeof options.time === "number") { this.t = options.time; }

  if(document !== undefined)
  {
   canvas = document.createElement("canvas");
   canvas.width = 300;
   canvas.height = 300;
   this.ctx = canvas.getContext("2d");
   this.ctx.strokeStyle = "rgba(255, 160, 0, 0.9)";
   this.ctx.lineWidth = canvas.width < canvas.height ? canvas.width * 0.1 : canvas.height * 0.1;
  }
 }

 this.t *= this.tm;
 this.T = this.t;

 if(this.ctx !== null)
 {
  this.render();
 }
}

Overtime.prototype = Object.create(EventDispatcher.prototype);
Overtime.prototype.constructor = Overtime;

/**
 * Getter and Setter for the internal canvas.
 * 
 * @param {canvas} c - The new canvas to draw on.
 */

Object.defineProperty(Overtime.prototype, "canvas", {
 get: function() { return this.ctx.canvas; },
 set: function(c)
 {
  if(c !== undefined && c.getContext !== undefined)
  {
   this.ctx = c.getContext("2d");
   this.ctx.strokeStyle = "rgba(255, 160, 0, 0.9)";
   this.ctx.lineWidth = (c.width < c.height) ? c.width * 0.1 : c.height * 0.1;
  }
 }
});

/**
 * Getter and Setter for the time.
 * 
 * @param {number} t - The new time. Will be translated to the current time measure.
 */

Object.defineProperty(Overtime.prototype, "time", {
 get: function() { return this.t; },
 set: function(t)
 {
  if(typeof t === "number")
  {
   this.t = t * this.tm;
   this.T = this.t;
  }
 }
});

/**
 * Getter and Setter for the time measure.
 * The current time will not be converted to the new time measure!
 * Use convertToTimeMeasure() for this instead.
 * 
 * @param {Overtime.TimeMeasure} tm - The new time measure.
 */

Object.defineProperty(Overtime.prototype, "timeMeasure", {
 get: function() { return this.tm; },
 set: function(tm)
 {
  if(typeof tm === "number")
  {
   this.tm = tm;
  }
 }
});

/**
 * Renders the time progress on the canvas.
 * This is the main loop.
 */

Overtime.prototype.render = function()
{
 var self = this,
  ctx = this.ctx,
  w = ctx.canvas.width,
  h = ctx.canvas.height,
  hw = w >> 1, hh = h >> 1,
  radius = w < h ? hw : hh,
  fullCircle = this.startAngle + this.TWO_PI,
  endAngle, elapsed, style;

 ctx.clearRect(0, 0, w, h);

 /*
  * Don't bleed over the edge.
  * (The canvas' size might change, so the
  * radius is always being recalculated.)
  */
 radius -= ctx.lineWidth;

 // Calculate the time span between this run and the last.
 this.now = Date.now();
 elapsed = this.now - this.then;
 this.then = this.now;
 this.t -= elapsed;

 // Draw the progress.
 endAngle = this.startAngle + this.TWO_PI * ((this.T - this.t) / this.T);
 ctx.beginPath();
 ctx.arc(hw, hh, radius, this.startAngle, endAngle, false);
 ctx.stroke();

 // Draw the rest of the circle in another color.
 if(endAngle < fullCircle)
 {
  style = ctx.strokeStyle;
  ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
  ctx.beginPath();
  ctx.arc(hw, hh, radius, endAngle, fullCircle, false);
  ctx.stroke();
  ctx.strokeStyle = style;
 }

 if(this.t > 0)
 {
  this.animId = requestAnimationFrame(function()
  {
   self.render();
  });
 }
 else
 {
  this.dispatchEvent(new Event("elapsed"));
 }
};

/**
 * Stops the rendering cycle. Does nothing more than that.
 */

Overtime.prototype.stop = function()
{
 if(this.animId !== 0)
 {
  cancelAnimationFrame(this.animId);
  this.animId = 0;
 }
};

/**
 * Tries to stop the rendering cycle first if it is still
 * running and then starts it again.
 */

Overtime.prototype.start = function()
{
 this.stop();
 this.render();
};

/**
 * Sets the time back to its original length and starts the system anew.
 */

Overtime.prototype.rewind = function()
{
 this.stop();
 this.t = this.T;
 this.start();
};

/**
 * Sets the time back by the given value. Uses
 * the currently set time measure for that value.
 * The time will not go back beyond the initial length.
 *
 * @param {number} t - The time value by which to rewind. Will be interpreted according to the current time measure.
 */

Overtime.prototype.rewindBy = function(t)
{
 this.stop();
 this.t += t;
 if(this.t > this.T) { this.t = this.T; }
 this.start();
};

/**
 * Converts the current time to the new time measure.
 * This will reset the time to its initial length.
 * 
 * @param {Overtime.TimeMeasure} tm - The new time measure.
 */

Overtime.prototype.convertToTimeMeasure = function(tm)
{
 this.t = this.T;
 this.t /= this.tm;
 this.tm = tm;
 this.t *= this.tm;
 this.T = this.t;
};

/**
 * Static enumeration of time measure constants.
 */

Overtime.TimeMeasure = Object.freeze({
 MILLISECONDS: 1,
 SECONDS: 1000,
 MINUTES: 60000,
 HOURS: 3600000
});

// Reveal public members.
module.exports = Overtime;
