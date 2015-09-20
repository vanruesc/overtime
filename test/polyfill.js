if(window.requestAnimationFrame === undefined || window.cancelAnimationFrame === undefined) {

	(function() {

		var x;
		var lastTime = 0;
		var vendors = ["ms", "moz", "webkit", "o"];

		for(x = 0; x < vendors.length && ! window.requestAnimationFrame; ++ x) {

			window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
			window.cancelAnimationFrame = window[vendors[x] + "CancelAnimationFrame"] || window[vendors[x] + "CancelRequestAnimationFrame"];

		}

		if(window.requestAnimationFrame === undefined && window.setTimeout !== undefined) {

			window.requestAnimationFrame = function(callback) {

				var currTime = Date.now();
				var elapsed = currTime - lastTime;
				var timeToCall = Math.max( 0, 16 - elapsed);

				lastTime = currTime + timeToCall;

				return window.setTimeout(function() {

					callback(lastTime);

				}, timeToCall);

			};

		}

		if(window.cancelAnimationFrame === undefined && window.clearTimeout !== undefined) {

			window.cancelAnimationFrame = function(id) {

				window.clearTimeout(id);

			};

		}

	}());

}
