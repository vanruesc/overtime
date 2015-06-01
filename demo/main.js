/**
 * Usage Demo:
 *  How to set up and use Overtime.
 *
 * @author Raoul van Rueschen
 * @version 1.0.0, 01.06.2015
 */

"use strict";

// Create an Overtime instance.
var overtime = new Overtime({
 time: 5,
 timeMeasure: Overtime.TimeMeasure.SECONDS,
 size: [420, 420]
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
 var container = document.getElementById("container");

 // Grab the output canvas and put it on the page.
 container.appendChild(overtime.canvas);

 function resize()
 {
  var min = (container.offsetWidth < container.offsetHeight) ? container.offsetWidth : container.offsetHeight;

  // Set the size of the canvas: [width, height].
  min -= 10;
  overtime.size = [min, min];

  // Center it vertically.
  //overtime.canvas.style.marginTop = (Math.abs(container.offsetWidth - container.offsetHeight) >> 1) + "px";
 }

 // Set the size right now.
 resize();

 // And handle window resize events.
 window.addEventListener("resize", resize);

 // Do something when the time elapsed.
 overtime.addEventListener("elapsed", function()
 {
  document.getElementById("textualOutput").innerHTML = "Time's up.";
 });

 // Control Overtime.
 document.getElementById("stop").addEventListener("click", function() { overtime.stop(); });
 document.getElementById("start").addEventListener("click", function() { overtime.start(); });
 document.getElementById("rewind").addEventListener("click", function() { overtime.rewind(); });

 // Clean up.
 window.removeEventListener("load", init);
});
