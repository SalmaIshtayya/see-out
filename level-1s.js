function changeic(newSrc, link) {
  var x = document.getElementById(link); //change icons when "onmuseover" or "onmuseout"
  x.src = newSrc;
  x.style.display = "inline";
}
let stopGame = document.getElementById("stopclc");
var overlay1 = document.getElementById("overlay");

var help = document.getElementById("help");
var overlay2 = document.getElementById("overlay2");

let runButtonCalcTime = document.getElementById("run-button");

var overlay3 = document.getElementById("overlay3");
let didWin = document.getElementById("win");

let tasks = [
  "Sort the blocks to print Hi!",
  "Sort the blocks to print 6 as a number.",
  "Sort the blocks to print Hello World! each word in a separate line.",
  "Sort the blocks to print cout<<'\n'<<endl;",
  "Classify the given values into the correct data types.",
  "Classify the given identifiers as valid or invalid, depending on the variable naming rules.",
  "All the given identifiers are valid. Classify them as good or bad identifiers, depending on how they convey the purpose, meaning, or role of the variable.",
  "Sort blocks to print 33 and rubbish data, each one in a separate line using variables. Check the hint!",
  "Classify the given operations into the correct operators.",
  "Sort the blocks to print 3.33333",
  "Sort the blocks to print 121.50",
  "Classify the conditions as true or false, depending on the priority order.",
  "If int x=3 and float y=6.0 and bool c=false, classify the conditions as true or false, depending on the priority order.",
  "Sort the blocks to print 4",
  "Sort the blocks to print 10",
  "Sort the blocks to print 99 using one statement of operations.",
  "Sort the blocks to print 7 using one statement of operations.",
  "Sort the blocks to print 44 and 5, each one in a separate line, using only two cout statements.",
  "Sort the blocks to print the user's age.",
  "Sort the blocks to print the summation of a and b.",
  "Sort the parts of the if-else statement.",
  "Sort the blocks to print Even if x is even or Odd if x is odd.",
  "Sort the blocks to print Adult if age is more than 20 and less than 60, or Old if age is more than 60.",
];
/*       if int x=3 and float y=6.0 and bool c=false -->*/

let outputsim = [
  /*1-1*/ "",
  /*1-2*/ "",
  /*1-3*/ "",
  /*1-4*/ "",
  /*1-5*/ "",
  /*2-1*/ "",
  /*2-2*/ "",
  /*2-3*/ "",
  /*2-4*/ "",
  /*3-1  10*/ "",
  /*3-2  11*/ "",
  /*3-3  12*/ "",
  /*3-4  13*/ "",
  /*1-1*/ "",
  /*1-2*/ "",
  /*1-3*/ "",
  /*1-4*/ "",
  /*1-5*/ "",
  /*2-1*/ "",
  /*2-2*/ "",
  /*2-3*/ "",
  /*2-4*/ "",
  /*3-1  10*/ "",
];

function openQuestion() {
  question(nnn, tasks[numberOfThisLevel - 1], outputsim[numberOfThisLevel - 1]); //
}

function openStop() {
  overlay.style.display = "block";
  stopGame.style.display = "block"; //desable game + stop the timer
  document.body.classList.add("no-scroll");
  stopTimer();
}

function continueGame() {
  overlay.style.display = "none";
  stopGame.style.display = "none"; // back to game + continue timer
  document.body.classList.remove("no-scroll");
  continueTimer();
}

function restartGame(event) {
  //restart the game + restart the timer
  restartTimer();
  startTimer();
  continueGame();
  closeWin();
}

function goTo(from, too) {
  // close this level and go to section 1 menue    [cancel the game]

  overlay1.style.display = "none";
  stopGame.style.display = "none"; // back to game + continue timer

  overlay3.style.display = "none";
  didWin.style.display = "none"; //desable game + stop the timer + show rate

  document.body.classList.remove("no-scroll");

  document.getElementById(from).style.display = "none";
  document.getElementById(too).style.display = "block";
}
function bak(x) {
  window.location.href = x;
}
function win(z) {
  var x = z + ".html";
  window.location.href = x;
}

function openHelp() {
  overlay2.style.display = "block";
  help.style.display = "block"; //desable game + stop the timer
  document.body.classList.add("no-scroll");
  stopTimer();
}
function closeHelp() {
  overlay2.style.display = "none";
  help.style.display = "none"; //desable game + stop the timer
  document.body.classList.remove("no-scroll");
  continueTimer();
}

function winThisLevel(x, y) {
  stopTimer();
  audioElement = document.getElementById("Audiowin");
  audioElement.play();
  overlay3.style.display = "block";
  didWin.style.display = "block"; //desable game + stop the timer + show rate
  document.body.classList.add("no-scroll");
  calcTimePersanteg();
}

function calcTimePersanteg() {
  document.getElementById("finalTime").innerText =
    9 - minutes + ":" + (59 - seconds);
}

function closeWin() {
  overlay3.style.display = "none";
  didWin.style.display = "none"; //desable game + stop the timer + show rate
  document.body.classList.remove("no-scroll");
}

//------------------------------------------------------timer functions-----------------------------

var timer; // Variable to store the timer
var timeLeft = 600; // Initial time set to 10 minutes (600 seconds)
var isTimerRunning = false; // Variable to track if timer is running
var minutes;
var seconds;
let x = document.getElementById("BGM");
let nnn = document.getElementById("numberOfThisLevel").innerHTML;
let numberOfThisLevel = Number(nnn);

window.onload = pageLoaded;

function pageLoaded() {
  question(nnn, tasks[numberOfThisLevel - 1], outputsim[numberOfThisLevel - 1]); //
  startTimer();
  //x.play();
}

function startTimer() {
  // Check if timer is not already running
  if (!isTimerRunning) {
    // Get the timer element
    var timerElement = document.getElementById("timer");

    // Update the timer every second
    timer = setInterval(function () {
      // Calculate minutes and seconds
      minutes = Math.floor(timeLeft / 60);
      seconds = timeLeft % 60;

      // Add leading zeros if necessary
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      // Display the timer
      timerElement.textContent = minutes + ":" + seconds;

      // Check if time is up
      if (timeLeft === 0) {
        clearInterval(timer); // Stop the timer
        alert("Time is up!"); // Alert time's up*************************************time is over
        restartGame();
      } else {
        timeLeft--; // Decrement time left
      }
    }, 1000); // Update every second

    isTimerRunning = true; // Set timer as running
  }
}

function stopTimer() {
  clearInterval(timer); // Stop the timer
  isTimerRunning = false; // Set timer as stopped
}

function continueTimer() {
  // Check if timer is stopped
  if (!isTimerRunning) {
    startTimer(); // Start the timer again
  }
}

function restartTimer() {
  clearInterval(timer); // Stop the timer
  timeLeft = 600; // Reset time left to 10 minutes
  document.getElementById("timer").textContent = "10:00"; // Reset timer display
  isTimerRunning = false; // Set timer as stopped
}
function goTLlev(from, too) {
  document.getElementById(from).style.display = "none";
  document.getElementById(too).style.display = "block";
}

function question(task, Quas, outp) {
  swal({
    title: "The task is :",
    text: Quas,
    icon: outp,
    button: "Ok",
  });
}
