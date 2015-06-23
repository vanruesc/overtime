# Overtime [![Build Status](https://travis-ci.org/vanruesc/overtime.svg?branch=master)](https://travis-ci.org/vanruesc/overtime) [![GitHub version](https://badge.fury.io/gh/vanruesc%2Fovertime.svg)](http://badge.fury.io/gh/vanruesc%2Fovertime) [![Dependencies](https://david-dm.org/vanruesc/overtime.svg?branch=master)](https://david-dm.org/vanruesc/overtime)

Overtime is a stop watch library that visualizes time limits in 2D by using the Canvas API.

## Usage

Download the [minified library](http://vanruesc.github.io/overtime/build/overtime.min.js) and include it in your project:

```html
<script src="/js/overtime.min.js"></script>
```

Then use Overtime like this:

```javascript
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

document.addEventListener("DOMContentLoaded", function init()
{
 // Grab the output canvas and put it on the page.
 document.getElementById("myContainer").appendChild(overtime.canvas);

 // Do something when the time elapsed.
 overtime.addEventListener("elapsed", function()
 {
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

To see how Overtime works, you may want to take a look at the [demo](https://vanruesc.github.io/overtime/demo).

## Contributing
Maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.

## Release History
No release yet.

## License
Copyright (c) 2015 Raoul van Rüschen  
Licensed under the Zlib license.
