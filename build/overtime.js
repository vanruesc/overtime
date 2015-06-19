/**
 * overtime build 04.06.2015
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
 * Event Dispatcher.
 *
 * A base class for adding and removing event listeners and dispatching events.
 */

function EventDispatcher()
{
 this._listeners = {};
}

/**
 * Adds an event listener.
 *
 * @param {string} type - The event type.
 * @param {function} listener - The event listener.
 */

EventDispatcher.prototype.addEventListener = function(type, listener)
{
 var listeners = this._listeners;

 if(listeners[type] === undefined)
 {
  listeners[type] = [];
 }

 if(listeners[type].indexOf(listener) === -1)
 {
  listeners[type].push(listener);
 }
};

/**
 * Checks if the event listener exists.
 *
 * @param {string} type - The event type.
 * @param {function} listener - The event listener.
 */

EventDispatcher.prototype.hasEventListener = function(type, listener)
{
 var listeners = this._listeners;
 return(listeners[type] !== undefined && listeners[type].indexOf(listener) !== -1);
};

/**
 * Removes an event listener.
 *
 * @param {string} type - The event type.
 * @param {function} listener - The event listener.
 */

EventDispatcher.prototype.removeEventListener = function(type, listener)
{
 var listeners = this._listeners,
  listenerArray = listeners[type],
  index;

 if(listenerArray !== undefined)
 {
  index = listenerArray.indexOf(listener);

  if(index !== -1)
  {
   listenerArray.splice(index, 1);
  }
 }
};

/**
 * Dispatches an event to all respective listeners.
 *
 * @param {Event} event - The event.
 */

EventDispatcher.prototype.dispatchEvent = function(event)
{
 var listeners = this._listeners,
  listenerArray = listeners[event.type],
  array, length, i;

 if(listenerArray !== undefined)
 {
  event.target = this;
  array = [];
  length = listenerArray.length;

  for(i = 0; i < length; ++i)
  {
   array[i] = listenerArray[i];
  }

  for(i = 0; i < length; ++i)
  {
   array[i].call(this, event);
  }
 }
};

// Expose module members.
module.exports = EventDispatcher;

},{}],2:[function(require,module,exports){
"use strict";

var EventDispatcher = require("./eventdispatcher");

/**
 * Overtime.
 * A time limit visualization library.
 *
 * @param {Object} options - The settings.
 * @param {number} options.time - The time limit.
 * @param {Array} [options.size] - The size of the canvas as an array: [width, height].
 * @param {Overtime.TimeMeasure} [options.timeMeasure] - The time measure of the supplied time limit. Defaults to seconds.
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
 this.updateEvent = {type: "update"};

 this.tm = Overtime.TimeMeasure.MILLISECONDS;
 this.t = 1;

 if(options !== undefined)
 {
  if(options.timeMeasure > 0) { this.tm = options.timeMeasure; }
  if(options.time > 0) { this.t = options.time; }

  if(document !== undefined)
  {
   canvas = document.createElement("canvas");
   canvas.id = "overtime";

   if(options.size !== undefined)
   {
    canvas.width = options.size[0];
    canvas.height = options.size[1];
   }
  }
 }

 this.t *= this.tm;
 this.T = this.t;

 if(canvas !== undefined)
 {
  this.canvas = canvas;
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
   this.stop();
   this.ctx = c.getContext("2d");
   this.ctx.strokeStyle = this.primaryStrokeStyle;
   this.size = [c.width, c.height];
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
  if(t > 0)
  {
   this.stop();
   this.t = t * this.tm;
   this.T = this.t;
   this.render();
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
  if(tm > 0)
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
 if(endAngle < this.fullCircle)
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

Overtime.prototype.update = function()
{
 var self = this,
  elapsed;

 // Calculate the time span between this run and the last.
 this.now = Date.now();
 elapsed = this.now - this.then;
 this.then = this.now;

 // Update the time.
 this.t -= elapsed;
 this.dispatchEvent(this.updateEvent);

 // Render the current state.
 this.render();

 // Continue or exit.
 if(this.t > 0)
 {
  this.animId = requestAnimationFrame(function()
  {
   self.update();
  });
 }
 else
 {
  this.dispatchEvent({type: "elapsed"});
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
 * running. Otherwise it restarts it.
 */

Overtime.prototype.start = function()
{
 this.stop();
 this.now = Date.now();
 this.then = this.now;
 this.update();
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
 * Sets the time back by the given value.
 * The time will not go back beyond the initial length.
 *
 * @param {number} t - The time by which to rewind. Interpreted according to the current time measure. A negative value corresponds to fast-forwarding.
 */

Overtime.prototype.rewindBy = function(t)
{
 if(typeof t === "number" && !isNaN(t))
 {
  this.stop();
  this.t += t * this.tm;
  if(this.t > this.T) { this.t = this.T; }
  this.render();
 }
};

/**
 * Goes ahead in time by a given value.
 *
 * @param {number} t - The time value by which to rewind. Will be interpreted according to the current time measure. A negative value corresponds to rewinding.
 */

Overtime.prototype.advanceBy = function(t)
{
 if(typeof t === "number" && !isNaN(t))
 {
  this.rewindBy(-t);
 }
};

/**
 * Adds time.
 *
 * @param {number} t - The time value to add. Will be interpreted according to the current time measure. A negative value corresponds to shortening.
 */

Overtime.prototype.prolongBy = function(t)
{
 if(typeof t === "number" && !isNaN(t))
 {
  this.stop();
  t *= this.tm;
  this.stop();
  this.t += t;
  this.T += t;
  if(this.T <= 0) { this.T = this.t = 1; }
  this.render();
 }
};

/**
 * Reduces the total duration of the countdown.
 *
 * @param {number} t - The time value to subtract. Will be interpreted according to the current time measure. A negative value corresponds to prolonging.
 */

Overtime.prototype.shortenBy = function(t)
{
 if(typeof t === "number" && !isNaN(t))
 {
  this.prolongBy(-t);
 }
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

},{"./eventdispatcher":1}]},{},[2])(2)
});