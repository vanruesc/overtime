/**
 * overtime build 26.05.2015
 *
 * Copyright 2015 Raoul van Rüschen
 * 
 * This software is provided "as-is", without any express or implied warranty. 
 * In no event will the authors be held liable for any damages arising from the use of this software.
 * 
 * Permission is granted to anyone to use this software for any purpose, 
 * including commercial applications, and to alter it and redistribute it freely, 
 * subject to the following restrictions:
 * 
 * The origin of this software must not be misrepresented; you must not claim that you wrote the original software. 
 * If you use this software in a product, an acknowledgment in the product documentation would be appreciated but is not required.
 * Altered source versions must be plainly marked as such, and must not be misrepresented as being the original software.
 * This notice may not be removed or altered from any source distribution.
 */

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Overtime = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}]},{},[1])(1)
});