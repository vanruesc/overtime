"use strict";

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

 this.TWO_PI = Math.PI * 2.0;
 this.ctx = null;
 this.dt = 1.0 / 60.0;
 this.now = Date.now() / 1000;
 this.then = this.now;
 this.animId = 0;
 this.accumulator = 0;

 this.tm = Overtime.TimeMeasure.MILLISECONDS;
 this.t = 0;

 if(options !== undefined)
 {
  // Take it, but round it. Just in case.
  if(options.frequency !== undefined && typeof options.frequency === "number" && options.frequency > 0) { this.frequency = options.frequency | 0; }
  if(options.timeMeasure !== undefined && typeof options.timeMeasure === "number") { this.tm = options.timeMeasure | 0; }
  if(options.time !== undefined && typeof options.time === "number") { this.t = options.time | 0; }

  if(options.container !== undefined)
  {
   canvas = document.createElement("canvas");
   canvas.width = 300;
   canvas.height = 300;
   options.container.appendChild(canvas);
   this.ctx = canvas.getContext("2d");
   this.ctx.strokeStyle = "rgba(40, 30, 20, 0.6)";
   this.ctx.lineWidth = 30;
  }
 }

 this.t *= this.tm;
 this.T = this.t;
 if(this.ctx !== null) { this.render(); }
}

/**
 * Getter and Setter for the internal canvas.
 * 
 * @param {HTMLElement} c - The new canvas to draw on.
 */

Object.defineProperty(Overtime.prototype, "canvas", {
 get: function() { return this.ctx.canvas; },
 set: function(c) { this.ctx = c.getContext("2d"); }
});

/**
 * Getter and Setter for the time.
 * 
 * @param {number} t - The new time. Will be translated to the current time measure.
 */

Object.defineProperty(Overtime.prototype, "time", {
 get: function() { return this.t; },
 set: function(t) { this.t = t * this.tm; }
});

/**
 * Getter and Setter for the time measure.
 * 
 * @param {Overtime.TimeMeasure} tm - The new time measure.
 */

Object.defineProperty(Overtime.prototype, "timeMeasure", {
 get: function() { return this.tm; },
 set: function(tm) { this.tm = tm; }
});

/**
 *
 */

Overtime.prototype.render = function()
{
 var self = this,
  ctx = this.ctx,
  w = ctx.canvas.width,
  h = ctx.canvas.height,
  hw = w >> 1, hh = h >> 1,
  anticlockwise = false,
  radius = w < h ? hw : hh,
  startAngle = Math.PI * 1.5,
  endAngle, elapsed;

 ctx.clearRect(0, 0, w, h);

 this.now = Date.now() / 1000;
 elapsed = this.now - this.then;
 this.accumulator += elapsed;
 this.then = this.now;

 if(this.accumulator >= this.dt)
 {
  this.t -= this.dt;
  this.accumulator -= this.dt;
 }

 this.t -= elapsed * 1000;

 radius -= ctx.lineWidth;
 endAngle = startAngle + this.TWO_PI * ((this.T - this.t) / this.T);
 ctx.beginPath();
 ctx.arc(hw, hh, radius, startAngle, endAngle, anticlockwise);
 ctx.stroke();

 if(this.t > 0)
 {
  this.animId = requestAnimationFrame(function()
  {
   self.render();
  });
 }
};

/**
 *
 */

Overtime.prototype.stop = function()
{
 clearTimeout(this.animId);
};

/**
 *
 */

Overtime.prototype.restart = function()
{
 this.stop();
 this.t = this.T;
 this.render();
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
