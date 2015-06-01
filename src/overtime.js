"use strict";

var EventDispatcher = require("./eventdispatcher");

/**
 * Overtime.
 * A time limit visualization library.
 *
 * @param {Object} options - The settings.
 * @param {number} options.time - The time limit.
 * @param {Array} [options.size] - The size of the canvas as an array: [width, height].
 * @param {Overtime.TimeMeasure} [options.timeMeasure] - The time measure of the supplied time limit. Falls back to seconds.
 */

function Overtime(options)
{
 var canvas;

 EventDispatcher.call(this);

 this.TWO_PI = Math.PI * 2.0;
 this.HALF_PI = Math.PI * 0.5;
 this.animId = 0;
 this.now = Date.now();
 this.then = this.now;
 this.ctx = null;
 this.startAngle = -this.HALF_PI;
 this.threshold = 0.023; // Chrome hack.
 this.fullCircle = this.startAngle + this.TWO_PI;
 this.primaryStrokeStyle = "rgba(255, 100, 0, 0.9)";
 this.secondaryStrokeStyle = "rgba(0, 0, 0, 0.1)";

 this.tm = Overtime.TimeMeasure.MILLISECONDS;
 this.t = 0;

 if(options !== undefined)
 {
  if(typeof options.timeMeasure === "number") { this.tm = options.timeMeasure; }
  if(typeof options.time === "number") { this.t = options.time; }

  if(document !== undefined)
  {
   canvas = document.createElement("canvas");
   canvas.id = "overtime";

   if(options.size !== undefined)
   {
    canvas.width = options.size[0];
    canvas.height = options.size[1];
   }

   this.ctx = canvas.getContext("2d");
   this.ctx.strokeStyle = this.primaryStrokeStyle;
   this.ctx.lineWidth = (canvas.width < canvas.height) ? canvas.width * 0.05 : canvas.height * 0.05;
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
   this.ctx.strokeStyle = this.primaryStrokeStyle;
   this.ctx.lineWidth = (c.width < c.height) ? c.width * 0.05 : c.height * 0.05;
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
 * The current time will not be affected by this in any way.
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
 * Getter and Setter for the size of the internal canvas.
 * 
 * @param {Array} s - The new size in the form of [width, height].
 */

Object.defineProperty(Overtime.prototype, "size", {
 get: function()
 {
  return [
   this.ctx.canvas.width,
   this.ctx.canvas.height
  ];
 },
 set: function(s)
 {
  if(s !== undefined)
  {
   this.ctx.canvas.width = s[0];
   this.ctx.canvas.height = s[1];
   this.ctx.lineWidth = (s[0] < s[1]) ? s[0] * 0.05 : s[1] * 0.05;
   this.render();
  }
 }
});

/**
 * Renders the time progress on the canvas.
 */

Overtime.prototype.render = function()
{
 var ctx = this.ctx,
  w = ctx.canvas.width,
  h = ctx.canvas.height,
  hw = w >> 1, hh = h >> 1,
  radius = w < h ? hw : hh,
  endAngle,
  tooThin; // Chrome hack.

 ctx.clearRect(0, 0, w, h);

 // Don't bleed over the edge.
 radius -= ctx.lineWidth;

 // Draw the progress.
 endAngle = this.startAngle + this.TWO_PI * ((this.T - this.t) / this.T);
 tooThin = (endAngle - this.startAngle < this.threshold); // Chrome hack.
 ctx.strokeStyle = this.primaryStrokeStyle;
 ctx.beginPath();
 ctx.arc(hw, hh, radius, tooThin ? this.startAngle - this.threshold : this.startAngle, endAngle, false); // Chrome hack.
 //ctx.arc(hw, hh, radius, this.startAngle, endAngle, false);
 ctx.stroke();
 if(tooThin) { ctx.clearRect(0, 0, hw - this.threshold, hh); } // Chrome hack.

 // Draw the rest of the circle in another color.
 if(endAngle< this.fullCircle)
 {
  // No hacking here cause can't clear.
  ctx.strokeStyle = this.secondaryStrokeStyle;
  ctx.beginPath();
  ctx.arc(hw, hh, radius, endAngle, this.fullCircle, false);
  ctx.stroke();
 }
};

/**
 * Steps the system forward.
 * This is the main loop.
 */

Overtime.prototype.step = function()
{
 var self = this,
  elapsed;

 // Calculate the time span between this run and the last.
 this.now = Date.now();
 elapsed = this.now - this.then;
 this.then = this.now;

 // Update the time.
 this.t -= elapsed;

 // Render the current state.
 this.render();

 // Continue or exit.
 if(this.t > 0)
 {
  this.animId = requestAnimationFrame(function()
  {
   self.step();
  });
 }
 else
 {
  this.dispatchEvent(new Event("elapsed"));
 }
};

/**
 * Stops the rendering cycle. Does nothing else besides that.
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
 * Tries to start the rendering cycle if it isn't
 * running. Restarts it otherwise.
 */

Overtime.prototype.start = function()
{
 this.stop();
 this.now = Date.now();
 this.then = this.now;
 this.step();
};

/**
 * Sets the time back to its original length.
 */

Overtime.prototype.rewind = function()
{
 this.stop();
 this.t = this.T;
 this.render();
};

/**
 * Sets the time back by the given value. Uses
 * the currently set time measure for that value.
 * The time will not go back beyond the initial length.
 *
 * @param {number} t - The time by which to rewind. Interpreted according to the current time measure. A negative value corresponds to fast-forwarding.
 */

Overtime.prototype.rewindBy = function(t)
{
 this.stop();
 this.t += t * this.tm;
 if(this.t > this.T) { this.t = this.T; }
 this.render();
};

/**
 * Goes ahead in time by a given value.
 *
 * @param {number} t - The time value by which to rewind. Will be interpreted according to the current time measure. A negative value corresponds to rewinding.
 */

Overtime.prototype.fastForwardBy = function(t)
{
 this.rewindBy(-t);
};

/**
 * Adds time.
 *
 * @param {number} t - The time value to add. Will be interpreted according to the current time measure. A negative corresponds to shortening.
 */

Overtime.prototype.prolongBy = function(t)
{
 this.stop();
 t *= this.tm;
 this.stop();
 this.t += t;
 this.T += t;
 if(this.T < 0) { this.T = this.t = 0; }
 this.render();
};

/**
 * Goes back in time by a given value.
 *
 * @param {number} t - The time value to subtract. Will be interpreted according to the current time measure. A negative value corresponds to prolonging.
 */

Overtime.prototype.shortenBy = function(t)
{
 this.prolongBy(-t);
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
