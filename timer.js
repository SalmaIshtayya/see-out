/*<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Stopwatch</title>
<style>
  #stopwatch {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  button {
    margin-right: 10px;
  }
</style>
</head>
<body>

<div id="stopwatch">00:00</div>
<button onclick="startStopwatch()">Start</button>
<button onclick="continueStopwatch()">Continue</button>
<button onclick="restartStopwatch()">Restart</button>
<button onclick="stopStopwatch()">Stop</button>
<div id="elapsedTime" style="display: none;"></div>
*/
//<script>
var startTime; // Variable to store the start time
var timerInterval; // Variable to store the setInterval ID
var globalMinutes = 0; // Global variable to store minutes
var globalSeconds = 0; // Global variable to store seconds

function startStopwatch() {
  startTime = new Date().getTime(); // Get the current time in milliseconds
  timerInterval = setInterval(updateTime, 1000); // Start the timer
}

function continueStopwatch() {
  startStopwatch(); // Start the stopwatch again
}

function stopStopwatch() {
  clearInterval(timerInterval); // Stop the timer
  // Display the elapsed time
  var elapsedTimeSeconds = Math.floor((new Date().getTime() - startTime) / 1000);
  globalMinutes += Math.floor(elapsedTimeSeconds / 60); // Update global minutes
  globalSeconds += elapsedTimeSeconds % 60; // Update global seconds
  document.getElementById("stopwatch").textContent = "Elapsed time: " + formatTime(globalMinutes, globalSeconds);
  document.getElementById("elapsedTime").textContent = formatTime(globalMinutes, globalSeconds);
  document.getElementById("elapsedTime").style.display = "block";
}

function restartStopwatch() {
  clearInterval(timerInterval); // Stop the timer
  globalMinutes = 0; // Reset global minutes
  globalSeconds = 0; // Reset global seconds
  document.getElementById("stopwatch").textContent = "Elapsed time: 00:00"; // Reset displayed time
  startStopwatch(); // Start the stopwatch
}

function updateTime() {
  var currentTime = new Date().getTime(); // Get the current time in milliseconds
  var elapsedTimeSeconds = Math.floor((currentTime - startTime) / 1000); // Calculate elapsed time in seconds
  document.getElementById("stopwatch").textContent = "Elapsed time: " + formatTime(globalMinutes, globalSeconds + elapsedTimeSeconds);
}

function formatTime(minutes, seconds) {
  var totalSeconds = minutes * 60 + seconds;
  var formattedMinutes = Math.floor(totalSeconds / 60);
  var formattedSeconds = totalSeconds % 60;
  return pad(formattedMinutes) + ":" + pad(formattedSeconds);
}

function pad(num) {
  return num.toString().padStart(2, "0");
}
/*</script>
</body>
</html>
*/