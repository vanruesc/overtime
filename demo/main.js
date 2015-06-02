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
 time: 2,
 timeMeasure: Overtime.TimeMeasure.MINUTES,
 size: [13, 37]
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

window.addEventListener("load", function init()
{
 var container = document.getElementById("container"),
  t = document.getElementById("t"),
  tm = document.getElementById("tm");

 // Grab the output canvas and put it on the page.
 container.appendChild(overtime.canvas);

 function resize()
 {
  var min = (container.offsetWidth < container.offsetHeight) ? container.offsetWidth : container.offsetHeight;

  // Set the size of the canvas: [width, height].
  min -= 10;
  overtime.size = [min, min];
 }

 // Set the size right now.
 resize();

 // And handle window resize events.
 window.addEventListener("resize", resize);

 // Do something when the time elapsed.
 overtime.addEventListener("elapsed", function()
 {
  document.getElementById("textualOutput").innerHTML = "Time's up!";
 });

 // Make use of Overtime's "update"-event.
 overtime.addEventListener("update", function()
 {
  document.getElementById("textualOutput").innerHTML = overtime.time;
 });

 // Control Overtime.
 document.getElementById("stop").addEventListener("click", function() { overtime.stop(); });
 document.getElementById("start").addEventListener("click", function() { overtime.start(); });
 document.getElementById("rewind").addEventListener("click", function() { overtime.rewind(); });
 document.getElementById("rewindBy").addEventListener("click", function() { overtime.rewindBy(parseInt(t.value)); });
 document.getElementById("advanceBy").addEventListener("click", function() { overtime.advanceBy(parseInt(t.value)); });
 document.getElementById("prolongBy").addEventListener("click", function() { overtime.prolongBy(parseInt(t.value)); });
 document.getElementById("shortenBy").addEventListener("click", function() { overtime.shortenBy(parseInt(t.value)); });
 document.getElementById("set").addEventListener("click", function() { overtime.time = parseInt(t.value); });
 tm.addEventListener("change", function() { overtime.tm = parseInt(tm.value); });

 // Temporary ad hoc solution.
 document.getElementById("request").addEventListener("click", function()
 {
  document.getElementById("qr").src = "http://caeb-fhbrandenburg.rhcloud.com/v1/qr?" + document.getElementById("uid").value;
 });

 // Clean up.
 window.removeEventListener("load", init);
});
