# Overtime [![Build Status](https://travis-ci.org/vanruesc/overtime.svg?branch=master)](https://travis-ci.org/vanruesc/overtime)

Overtime is a stop watch library that visualizes time limits in 2D by using the Canvas API.

[CDN](http://vanruesc.github.io/overtime/build/overtime.min.js)

## Usage

Include the library. (for example from the CDN.)

```html
<script src="http://vanruesc.github.io/overtime/build/overtime.min.js"></script>
```

```javascript
document.addEventListener("DOMContentLoaded", function()
{
 var ot = new Overtime({
  time: 4,
  timeMeasure: Overtime.TimeMeasure.SECONDS,
  container: document.getElementById("myContainer")
 });

 ot.addEventListener("elapsed", function()
 {
  console.log("Time ran out.");
 });
});
```

## Example

To see how Overtime works, you may take a look at this [example](https://jsfiddle.net/5ua4kcm1/).

## Contributing
Maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.

## Release History
No release yet.

## License
Copyright (c) 2015 Raoul van Rüschen  
Licensed under the Zlib license.
