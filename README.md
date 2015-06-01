# Overtime [![Build Status](https://travis-ci.org/vanruesc/overtime.svg?branch=master)](https://travis-ci.org/vanruesc/overtime)

Overtime is a stop watch library that visualizes time limits in 2D by using the Canvas API.

## Usage

Download the [minified library](http://vanruesc.github.io/overtime/build/overtime.min.js) and include it on your page:

```html
<script src="/js/overtime.min.js"></script>
```

Then use Overtime in your like this:

```javascript
// Create an Overtime instance.
var overtime = new Overtime({
 time: 5,
 timeMeasure: Overtime.TimeMeasure.MINUTES,
 size: [300, 300]
});

/*
 * At some point, you may actually want to show the 
 * output of Overtime on your website.
 *
 * In order to append its canvas to your page, you'll 
 * have to listen for the "DOMContentLoaded"-event of
 * the document object.
 *
 * If you want to rely on the sizes of DOM elements 
 * such as the body of your page, you'll use the
 * "load"-event of the window object.
 */

window.addEventListener("load", function init()
{
 // Grab the output canvas and put it on the page.
 document.getElementById("myContainer").appendChild(overtime.canvas);

 // Do something when the time elapsed.
 overtime.addEventListener("elapsed", function()
 {
  console.log("Time's up.");
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
 window.removeEventListener("load", init);
});
```

## Example

To see how Overtime works, you may take a look at this [example](https://jsfiddle.net/vanruesc/2Lv3kc02/2/).

## Contributing
Maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.

## Release History
No release yet.

## License
Copyright (c) 2015 Raoul van Rüschen  
Licensed under the Zlib license.
