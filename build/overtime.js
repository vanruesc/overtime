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
 * Event Dispatcher.
 *
 * A base class for adding and removing event listeners and dispatching events.
 */

function EventDispatcher()
{
 this._listeners = {};
}

/**
 * Adds an event listener exists.
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
 * Removes an event listener exists.
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
  //event.target = this; // Not writable.
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

var EventDispatcher = require("./eventdispatcher.js");

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
 this.ctx = null;
 this.now = Date.now();
 this.then = this.now;
 this.animId = 0;

 this.tm = Overtime.TimeMeasure.MILLISECONDS;
 this.t = 0;

 if(options !== undefined)
 {
  // Take it, but round it. Just in case.
  if(typeof options.timeMeasure === "number") { this.tm = options.timeMeasure | 0; }
  if(typeof options.time === "number") { this.t = options.time | 0; }

  if(options.container !== undefined)
  {
   canvas = document.createElement("canvas");
   canvas.width = 300;
   canvas.height = 300;
   options.container.appendChild(canvas);
   this.ctx = canvas.getContext("2d");
   this.ctx.strokeStyle = "rgba(255, 160, 0, 0.9)";
   this.ctx.lineWidth = 32;
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

 this.now = Date.now();
 elapsed = this.now - this.then;
 this.then = this.now;
 this.t -= elapsed;

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
 else
 {
  this.dispatchEvent(new Event("elapsed"));
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

},{"./eventdispatcher.js":1}]},{},[2])(2)
});