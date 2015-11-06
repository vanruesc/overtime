/**
 * overtime v0.1.5 build Nov 06 2015
 * https://github.com/vanruesc/overtime
 * Copyright 2015 Raoul van Rüschen, Zlib
 */
var Overtime = (function () { 'use strict';

	/**
	 * A base class for adding and removing event listeners and dispatching events.
	 *
	 * @class EventDispatcher
	 * @constructor
	 */

	function EventDispatcher() {

		/**
		 * A map of listeners.
		 *
		 * @property _listeners
		 * @type Object
		 * @private
		 */

		this._listeners = {};

	}

	/**
	 * Extends an object with the event dispatcher functionality.
	 *
	 * @method apply
	 * @param {Object} object - The object.
	 * @example
	 *  EventDispatcher.prototype.apply(X.prototype);
	 */

	EventDispatcher.prototype.apply = function(object) {

		object._listeners = {};
		object.addEventListener = EventDispatcher.prototype.addEventListener;
		object.hasEventListener = EventDispatcher.prototype.hasEventListener;
		object.removeEventListener = EventDispatcher.prototype.removeEventListener;
		object.dispatchEvent = EventDispatcher.prototype.dispatchEvent;

	};

	/**
	 * Adds an event listener.
	 *
	 * @method addEventListener
	 * @param {String} type - The event type.
	 * @param {Function} listener - The event listener.
	 */

	EventDispatcher.prototype.addEventListener = function(type, listener) {

		if(this._listeners[type] === undefined) {

			this._listeners[type] = [];

		}

		if(this._listeners[type].indexOf(listener) === -1) {

			this._listeners[type].push(listener);

		}

	};

	/**
	 * Checks if the event listener exists.
	 *
	 * @method hasEventListener
	 * @param {String} type - The event type.
	 * @param {Function} listener - The event listener.
	 */

	EventDispatcher.prototype.hasEventListener = function(type, listener) {

		return (this._listeners[type] !== undefined && this._listeners[type].indexOf(listener) !== -1);

	};

	/**
	 * Removes an event listener.
	 *
	 * @method removeEventListener
	 * @param {String} type - The event type.
	 * @param {Function} listener - The event listener.
	 */

	EventDispatcher.prototype.removeEventListener = function(type, listener) {

		var i, listenerArray;

		listenerArray = this._listeners[type];

		if(listenerArray !== undefined) {

			i = listenerArray.indexOf(listener);

			if(i !== -1) {

				listenerArray.splice(i, 1);

			}

		}

	};

	/**
	 * Dispatches an event to all respective listeners.
	 *
	 * @method dispatchEvent
	 * @param {Object} event - The event.
	 */

	EventDispatcher.prototype.dispatchEvent = function(event) {

		var i, l, listenerArray;

		listenerArray = this._listeners[event.type];

		if(listenerArray !== undefined) {

			event.target = this;

			for(i = 0, l = listenerArray.length; i < l; ++i) {

				listenerArray[i].call(this, event);

			}

		}

	};

	/**
	 * A time limit visualization library.
	 *
	 * @class Overtime
	 * @constructor
	 * @param {Object} [options] - The settings.
	 * @param {Number} [options.time] - The time limit.
	 * @param {Number} [options.canvas] - The canvas to use. A new one will be created if none is supplied.
	 * @param {Boolean} [options.clearCanvas=true] - Whether the canvas should be cleared before rendering.
	 * @param {Array} [options.size] - The size of the canvas.
	 * @param {Overtime.TimeMeasure} [options.timeMeasure=Overtime.TimeMeasure.SECONDS] - The time measure of the supplied time limit.
	 */

	function Overtime(options) {

		var self = this, o;

		EventDispatcher.call(this);

		/**
		 * PI * 2.
		 *
		 * @property TWO_PI
		 * @type Number
		 * @private
		 * @final
		 */

		this.TWO_PI = Math.PI * 2.0;

		/**
		 * PI / 2.
		 *
		 * @property HALF_PI
		 * @type Number
		 * @private
		 * @final
		 */

		this.HALF_PI = Math.PI * 0.5;

		/**
		 * Clear canvas flag.
		 *
		 * @property clearCanvas
		 * @type Boolean
		 */

		this.clearCanvas = true;

		/**
		 * Animation id of the currently requested frame.
		 *
		 * @property animId
		 * @type Number
		 * @private
		 */

		this.animId = 0;

		/**
		 * Used for time-based rendering.
		 *
		 * @property now
		 * @type Number
		 * @private
		 */

		this.now = Date.now();

		/**
		 * Used for time-based rendering.
		 *
		 * @property then
		 * @type Number
		 * @private
		 */

		this.then = this.now;

		/**
		 * The rendering context.
		 *
		 * @property ctx
		 * @type CanvasRenderingContext2D
		 * @private
		 */

		this.ctx = null;

		// Set the initial canvas.
		this.canvas = document.createElement("canvas");

		/**
		 * the start angle.
		 *
		 * @property startAngle
		 * @type Number
		 * @private
		 */

		this.startAngle = -this.HALF_PI;

		/**
		 * A float threshold for the chrome rendering hack.
		 *
		 * @property threshold
		 * @type Number
		 * @private
		 */

		this.threshold = 0.023;

		/**
		 * Radians of the full circle plus the start angle.
		 *
		 * @property fullCircle
		 * @type Number
		 * @private
		 */

		this.fullCircle = this.startAngle + this.TWO_PI;

		/**
		 * Colour of the progressing circle.
		 *
		 * @property primaryStrokeStyle
		 * @type String
		 * @default rgba(255, 100, 0, 0.9)
		 */

		this.primaryStrokeStyle = "rgba(255, 100, 0, 0.9)";

		/**
		 * Colour of the empty circle.
		 *
		 * @property secondaryStrokeStyle
		 * @type String
		 * @default rgba(0, 0, 0, 0.1)
		 */

		this.secondaryStrokeStyle = "rgba(0, 0, 0, 0.1)";

		/**
		 * Returns the remaining time.
		 *
		 * @event update
		 * @param {Number} time - The remaining time.
		 */

		this.updateEvent = {type: "update", time: 0};

		/**
		 * The currently set time measure.
		 *
		 * @property tm
		 * @type Overtime.TimeMeasure
		 * @private
		 */

		this.tm = Overtime.TimeMeasure.MILLISECONDS;

		/**
		 * The remaining time in milliseconds.
		 *
		 * @property t
		 * @type Number
		 * @private
		 */

		this.t = 1;

		// Overwrite the defaults.
		if(options !== undefined) {

			if(options.timeMeasure > 0) { this.tm = options.timeMeasure; }
			if(options.time > 0) { this.t = options.time; }
			if(options.canvas !== undefined) { this.canvas = options.canvas; }
			this.size = options.size;

		}

		// Update the time.
		this.t *= this.tm;

		/**
		 * The total time.
		 *
		 * @property T
		 * @type Number
		 * @private
		 */

		this.T = this.t;

		// Try to recover time values from a previous session.
		if(localStorage.getItem("overtime")) {

			try {

				o = JSON.parse(localStorage.getItem("overtime"));
				if(o.tm !== undefined) { this.tm = o.tm; }
				if(o.t !== undefined) { this.t = o.t; }
				if(o.T !== undefined) { this.T = o.T; }

			} catch(e) { /* Swallow. */ }

		}

		/**
		 * Stores the time values for the next session.
		 *
		 * @method persist
		 * @private
		 */

		window.addEventListener("unload", function persist() {

			localStorage.setItem("overtime", JSON.stringify({
				tm: self.tm,
				t: self.t,
				T: self.T
			}));

		});

		/**
		 * The update function.
		 *
		 * @method update
		 */

		this.update = function() { self._update(); };

	}

	Overtime.prototype = Object.create(EventDispatcher.prototype);
	Overtime.prototype.constructor = Overtime;

	/**
	 * The internal canvas.
	 *
	 * @property canvas
	 * @type HTMLCanvasElement
	 */

	Object.defineProperty(Overtime.prototype, "canvas", {

		get: function() { return this.ctx.canvas; },

		set: function(c) {

			if(c !== undefined && c.getContext !== undefined) {

				this.stop();
				this.ctx = c.getContext("2d");
				this.ctx.strokeStyle = this.primaryStrokeStyle;
				this.size = [c.width, c.height];

			}

		}

	});

	/**
	 * The time. When set, the given value will be translated to the current time measure.
	 *
	 * @property time
	 * @type Number
	 */

	Object.defineProperty(Overtime.prototype, "time", {

		get: function() { return this.t; },

		set: function(t) {

			if(t >= 0) {

				this.stop();
				this.t = t * this.tm;
				this.T = this.t;
				this._render();

			}

		}

	});

	/**
	 * The current time measure.
	 * The current time will not be affected by this in any way.
	 *
	 * @property timeMeasure
	 * @type Overtime.TimeMeasure
	 */

	Object.defineProperty(Overtime.prototype, "timeMeasure", {

		get: function() { return this.tm; },

		set: function(tm) {

			if(tm > 0) {

				this.tm = tm;

			}

		}

	});

	/**
	 * The size of the canvas.
	 *
	 * @property size
	 * @type Number
	 * @example
	 *  [width, height]
	 */

	Object.defineProperty(Overtime.prototype, "size", {

		get: function() {

			return [
				this.ctx.canvas.width,
				this.ctx.canvas.height
			];

		},

		set: function(s) {

			if(s !== undefined) {

				this.ctx.canvas.width = s[0];
				this.ctx.canvas.height = s[1];
				this.ctx.lineWidth = (s[0] < s[1]) ? s[0] * 0.05 : s[1] * 0.05;
				this._render();

			}

		}

	});

	/**
	 * Renders the time progress on the canvas.
	 *
	 * @method _render
	 * @private
	 */

	Overtime.prototype._render = function() {

		var ctx = this.ctx,
			w = ctx.canvas.width,
			h = ctx.canvas.height,
			hw = w >> 1, hh = h >> 1,
			radius = w < h ? hw : hh,
			endAngle,
			tooThin; // Chrome hack.

		if(this.clearCanvas) { ctx.clearRect(0, 0, w, h); }

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
		if(endAngle < this.fullCircle) {

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
	 *
	 * @method _update
	 * @private
	 */

	Overtime.prototype._update = function() {

		var elapsed;

		// Calculate the time span between this run and the last.
		this.now = Date.now();
		elapsed = this.now - this.then;
		this.then = this.now;

		// Update the time.
		this.t -= elapsed;
		if(this.t < 0) { this.t = 0; }
		this.updateEvent.time = this.t;
		this.dispatchEvent(this.updateEvent);

		// Render the time.
		this._render();

		// Continue or exit.
		if(this.t > 0) {

			this.animId = requestAnimationFrame(this.update);

		} else {

			this.dispatchEvent({type: "elapsed"});

		}

	};

	/**
	 * Stops the rendering cycle. Does nothing else besides that.
	 *
	 * @method stop
	 */

	Overtime.prototype.stop = function() {

		if(this.animId !== 0) {

			cancelAnimationFrame(this.animId);
			this.animId = 0;

		}

	};

	/**
	 * Tries to start the rendering cycle if it isn't
	 * running. Otherwise it restarts it.
	 *
	 * @method start
	 */

	Overtime.prototype.start = function() {

		this.stop();
		this.now = Date.now();
		this.then = this.now;
		this.update();

	};

	/**
	 * Sets the time back to its original length.
	 *
	 * @method rewind
	 */

	Overtime.prototype.rewind = function() {

		this.stop();
		this.t = this.T;
		this._render();

	};

	/**
	 * Sets the time back by the given value.
	 * The time will not go back beyond the initial length.
	 *
	 * @method rewindBy
	 * @param {Number} t - The time by which to rewind. Interpreted according to the current time measure. A negative value corresponds to fast-forwarding.
	 */

	Overtime.prototype.rewindBy = function(t) {

		if(typeof t === "number" && !isNaN(t) && t !== 0) {

			this.stop();
			this.t += t * this.tm;
			if(this.t > this.T) { this.t = this.T; }
			this._render();

		}

	};

	/**
	 * Goes ahead in time by a given value.
	 *
	 * @method advanceBy
	 * @param {Number} t - The time value by which to rewind. Will be interpreted according to the current time measure. A negative value corresponds to rewinding.
	 */

	Overtime.prototype.advanceBy = function(t) {

		if(typeof t === "number" && !isNaN(t)) {

			this.rewindBy(-t);

		}

	};

	/**
	 * Adds time.
	 *
	 * @method prolongBy
	 * @param {Number} t - The time value to add. Will be interpreted according to the current time measure. A negative value corresponds to shortening.
	 */

	Overtime.prototype.prolongBy = function(t) {

		if(typeof t === "number" && !isNaN(t) && t !== 0) {

			this.stop();
			t *= this.tm;
			this.t += t;
			this.T += t;
			if(this.T < 0) { this.T = this.t = 0; }
			this._render();

		}

	};

	/**
	 * Reduces the total duration of the countdown.
	 *
	 * @method shortenBy
	 * @param {Number} t - The time value to subtract. Will be interpreted according to the current time measure. A negative value corresponds to prolonging.
	 */

	Overtime.prototype.shortenBy = function(t) {

		if(typeof t === "number" && !isNaN(t)) {

			this.prolongBy(-t);

		}

	};

	/**
	 * Enumeration of time measure constants.
	 *
	 * @property TimeMeasure
	 * @type Object
	 * @static
	 * @final
	 */

	Overtime.TimeMeasure = Object.freeze({
		MILLISECONDS: 1,
		SECONDS: 1000,
		MINUTES: 60000,
		HOURS: 3600000
	});

	return Overtime;

})();