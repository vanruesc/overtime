# Overtime 
[![Build status](https://travis-ci.org/vanruesc/overtime.svg?branch=master)](https://travis-ci.org/vanruesc/overtime) 
[![Windows build status](https://ci.appveyor.com/api/projects/status/t7fv9k65w0wmyfea?svg=true)](https://ci.appveyor.com/project/vanruesc/overtime) 
[![GitHub version](https://badge.fury.io/gh/vanruesc%2Fovertime.svg)](http://badge.fury.io/gh/vanruesc%2Fovertime) 
[![npm version](https://badge.fury.io/js/overtime.svg)](http://badge.fury.io/js/overtime) 
[![Dependencies](https://david-dm.org/vanruesc/overtime.svg?branch=master)](https://david-dm.org/vanruesc/overtime)

Overtime is a stopwatch library that visualises time limits in 2D by using the Canvas API.


## Installation

Download the [minified library](http://vanruesc.github.io/overtime/build/overtime.min.js) and include it in your project:

```html
<script src="/js/overtime.min.js"></script>
```

You can also install it with [npm](https://www.npmjs.com).

```sh
$ npm install overtime
``` 


## Usage

```javascript
import Overtime from "overtime";

// Create an Overtime instance.
var overtime = new Overtime({
	time: 5,
	timeMeasure: Overtime.TimeMeasure.MINUTES,
	size: [300, 300]
});

/*
 * In order to append the canvas of Overtime to your 
 * website, you'll have to listen for the document's
 * "DOMContentLoaded"-event.
 *
 * If you want to rely on the sizes of DOM elements 
 * such as the body of your page, you should use the
 * "load"-event of the window object instead.
 */

document.addEventListener("DOMContentLoaded", function init() {

	// Grab the output canvas and put it on the page.
	document.getElementById("myContainer").appendChild(overtime.canvas);

	// Do something when the time elapsed.
	overtime.addEventListener("elapsed", function() {

		console.log("Time's up!");

	});

	// Control Overtime.
	overtime.stop();
	overtime.start();
	overtime.rewind();
	overtime.rewindBy(Number.MAX_VALUE);
	overtime.fastForwardBy(2);
	overtime.prolongBy(2);
	overtime.timeMeasure = Overtime.TimeMeasure.MILISECONDS;
	overtime.shortenBy(100);
	overtime.timeMeasure = Overtime.TimeMeasure.HOURS;
	overtime.time = 1;

	// Clean up.
	document.removeEventListener("DOMContentLoaded", init);

});
```

## Example
Take a look at the [demo](https://vanruesc.github.io/overtime/demo) to see how Overtime works.


## Documentation
[API](http://vanruesc.github.io/overtime/docs)


## Contributing
Maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.


## License
Copyright (c) 2015 Raoul van Rüschen  
Licensed under the Zlib license.
