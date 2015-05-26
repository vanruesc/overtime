# Overtime [![Build Status](https://travis-ci.org/vanruesc/overtime.svg?branch=master)](https://travis-ci.org/vanruesc/overtime)

Overtime is a stop watch library that visualizes time limits in 2D by using the Canvas API.

## Usage

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

## Contributing
Maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.

## Release History
No release yet.

## License
Copyright (c) 2015 Raoul van Rüschen  
Licensed under the Zlib license.
