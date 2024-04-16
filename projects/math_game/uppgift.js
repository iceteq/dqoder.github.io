/**
* Vad är detta? Jag har löst 3 uppgifter i ett program. 
* 
* För att göra det lätt att rätta har jag listat alla saker som var krav
* på de olika uppgifterna. 
*
* Alla delar som finns implementerade i koden har "*" framför.
* Dvs.. allt som jag har inkluderat i det här programmet har en * framför.
*
* OM något inte finns med här, så har jag angivit var detta 
* går att hitta istället.
*
* -----------------------------------------------------------
*
* 3.1.1 Globala JavaScript-objekt obligatorisk
*
* * Array (obligatorisk)
*   Boolean (obligatorisk) PLEASE SEE 3.1.3! OR regexp_losning subfolder
* * Date (obligatorisk)
* * Math (obligatorisk)
* * Number (obligatorisk)
* * String (obligatorisk)
*   RegExp (obligatorisk) PLEASE SEE 3.1.3! OR regexp_losning subfolder
*   globalThis (frivillig)
*
* 3.1.2 Webbläsar-objekt
*
* * alert (obligatorisk)
* * confirm (obligatorisk)
* * prompt (obligatorisk)
* * open (obligatorisk) - PLEASE SEE index.js 
* * close (obligatorisk) - PLEASE SEE index.js
* * setInterval (obligatorisk) 
* * clearInterval (obligatorisk) 
* * setTimeout (obligatorisk) 
* * clearTimeout (obligatorisk)

* 3.2.2 Effekter och animationer
*
* * show (obligatorisk) 
* * hide (obligatorisk)
* * toggle (obligatorisk)
* * fadeIn (obligatorisk) 
* * fadeOut (obligatorisk) 
* * fadeToggle (obligatorisk)
* * fadeTo (obligatorisk)
* * Easing: linear eller swing (testa med olika hastigheter) (obligatorisk)
* * Att en händelse sker efter animationen är klar (callback funktion)
*/


/* 
----- What is this program? -----

It's a game that the user's math skills,

 with the ability to
set its difficulty by picking the 
number of digits to have in the problems.

It is not fully customizable now 
- you cannot pick a time limit, for example.

Nor can you choose to practice something other than addition. 

Your
previous results are saved if your score was above 0.

*/

const userAnswer = document.querySelector("[id=userAnswer]");



var term1 = document.getElementById("term1");
var term2 = document.getElementById("term2");
var problem = document.getElementById("problem");
var counter = document.getElementsByClassName("timePassed")[0];
var counter_sw = document.getElementsByClassName("timePassed2")[0];
var problemNumber = 0;
const secPerProblem = 10; // seconds user gets to solve a problem
const numberOfProblems = 3; // for now, lets only allow 3 problems
var gameInProgress = false;

var previousResults = [];



/**
 * Every problem will be an addition problem, for now. 
 * And a problem is simply an object with two terms and a correct answer.
 * I thought it would be a good idea to encapsulate these three things
 * in one class.
 */
class AdditionProblem {
  constructor(term1, term2) {
    if (Number(term1) === NaN || Number(term2) === NaN) {
      alert(
        "One of your terms is not a number! Or at least I could not convert it to one"
      );
    }

    this.term1 = term1;
    this.term2 = term2;
    this.correctAnswer = term1 + term2;
  }
}

/**
 * Every user has a score. This makes sense. However, I am not sure 
 * the answer and whether it was correct is actually conceptually something 
 * that is part of the user object. I need to consider creating a separate
 * class for those fields.
 */
class User {
  constructor(userAnswer, userScore) {
    this.userAnswer = userAnswer;
    this.userScore = userScore;
    this.answeredCorrectly = false;
  }
};

/**
 * This is how we generate problems for the user to solve.
 * I thought it would be important to generate those before the game starts,
 * rather than generating the problems dynamically. Why? Probably
 * better for performance. Once the game starts, we will fetch
 * problem[1], problem[2] etc..
 */
var problems = []; // declaring this as [] and not "any", because it allows me to use .length later
function generateQuestions(numberOfQuestions, digits) {
  problems = new Array(numberOfProblems); // array with length 10
  for (var i = 0; i < numberOfProblems; i++) {
    problems[i] = new AdditionProblem(
      Math.floor(Math.random() * Math.pow(10, digits)),
      Math.floor(Math.random() * Math.pow(10, digits))
    );
  }
}

/**
 * just takes the problem and reads its term1 and term1 .. 
 * its always addition so no need to read that in for now.
 * @param {*} i
 */
function displayProblem(i) {
  term1.innerHTML = problems[i].term1;
  term2.innerHTML = problems[i].term2;
}

var user = new User();

/**
 * Before we start a round, we need to ask the user how many
 * digits the problems should have. We do that when the window loads.
 */
numOfDigits = 0;
window.addEventListener("load", loadFunction);
function loadFunction() {
  askUserHowManyDigits();
  if (input == null) return; // stop script
  numOfDigits = input;
}

/**
 * Starting round involves a lot of things. 
 * 
 * Game controls: We need to
 * start reacting to the Enter key, because the user will 
 * submit the answer by pressing Enter.
 * 
 * Convenience: We need to select the input field, 
 * so that the user doesn't need to
 * do that manually. 
 * 
 * Start the problem counter.
 * 
 * Initialize game just means generating the problems
 * that will be displayed, and then display the first problem. 
 * 
 * see "stopGame()" also.
 */
function startRound() {
  startReactingToEnterKey();
  selectInput();
  problemNumber = 0;
  initializeGame();
  startTimer(secPerProblem);
  start_sw();
}

/**
 * Before we start a round, we need to already have all the problems ready.
 * THis is where we generate the problems. 
 */
function initializeGame() {
  generateQuestions(numberOfProblems, numOfDigits);
  displayProblem(problemNumber);
}

/**
 * For the convience of the user. So they don't need to
 * select the input field.
 */
function selectInput() {
  userAnswer.disabled = false;
  userAnswer.focus();
  userAnswer.select();
}

/**
 * Before any problems are generated, we need to know how difficult
 * those problems will be (how many digits)
 */
function askUserHowManyDigits() {
  while (true) {
    input = prompt("How many digits should there be?");

    if (input == null) {
      break;
    }

    if (input > 6 || input == "") {
      alert(
        new String("Sorry, I don't think you should be able to add that many/few digits").toUpperCase()
      );
    } else {
      if (!isNaN(input)) {
        break;
      }
    }
  }
}



// ---------------- TIMER SECTION ---------------- //
// SETS A LIMIT TO HOW LONG YOU CAN SPEND TRYING TO SOLVE PROBLEMS

var startTime, countAmt, interval, interval2;
var secondsLeft;

/**
 * This happens every 1000ms. We reduce secondsLeft,
 * and display the updated "secondsLeft" on the page.
 * 
 * BUT 
 * If seconds left is 0
 * then the user lost, so we need to immediately tell them 
 * that. And call endGame(). 
 */
function tick() {
  if (secondsLeft > 0) {
    secondsLeft--;
    updateCountdownDisplay(secondsLeft);
    interval = setTimeout(tick, 1000);
  } else {
    clearTimeout(interval);
    updateCountdownDisplay(0);
    alert("you lost and your score is " + problemNumber); // yes problemNumber is the same as score!
    addToResults(problemNumber);
    endGame();
  }
}

/**
 * How do we start a timer? Conceptually it means
 * start showing how many seconds are left on the page, 
 * and then begin ticking down. 
 * 
 * Every tick (every second), we will need to do something, 
 * for example call updateCountdownDisplay again
 * so that you see how many seconds are left.
 * 
 * See tick() for more info what happens every 1000 ms
 * 
 * @param {*} secs 
 */
function startTimer(secs) {
  clearTimeout(interval);
  secondsLeft = secs;
  updateCountdownDisplay(secondsLeft);
  interval = setTimeout(tick, 1000);
}
function stopTimer() {
  clearTimeout(interval);
  secondsLeft = 0;
  updateCountdownDisplay(secondsLeft);
}
function updateCountdownDisplay(seconds) {
  counter.innerHTML = new Date(seconds * 1000).toISOString().slice(11, 19);
}

function endGame() {
  toggleDistractions(false);
  hideBox();
  stop_sw();
  stopTimer();
  stopReactingToEnterKey();
}

// ---------------- STOPWATCH SECTION---------------- //
/**
 * Note: this is not the same as timer. 
 * 
 * Here we track how long it took the user to play a around.
 * Later we could use this to calculate speed per problem solved
 * or something like that. 
 * 
 * For now we will just use this to display as part of the result.
 * 
 * The timer counts down, this one counts up.
 * 
 * Every second the timer runs tick(), but the stopwatch runs tick_sw()
 * 
 * The idea is still pretty similar. You just change an integer (seconds_passed)
 * and dislay the new value on the page. 
 * 
 * stopwatches are simpler, because you can just let it run and leave it alone,
 * and when you want to stop it you call stop_sw, which will
 * call clearInterval and stop ticking.
 */

var interval_sw;
var seconds_passed = 0;
function tick_sw() {
  seconds_passed++;
  updateStopWatchDisplay(seconds_passed);
}
function start_sw() {
  clearInterval(interval_sw);
  interval_sw = setInterval(tick_sw, 1000);
  updateStopWatchDisplay(seconds_passed);
}
function stop_sw() {
  seconds_passed = 0;
  updateStopWatchDisplay(seconds_passed);
  clearInterval(interval_sw);
}
function getTimePassed() {
  return new Date(seconds_passed * 1000).toISOString().slice(11, 19);
}

function updateStopWatchDisplay(seconds) {
  counter_sw.innerHTML = new Date(seconds * 1000).toISOString().slice(11, 19);
}


/**
 * What: Does several things when the user submits an answer by pressing enter.
 * - check if it's a number. 
 * 
 * checks if the answer is correct
 * - clears the input field if the answer is correct, so that we start fresh on the next problem.
 * - change the progress indicator, which gives a visual hint as to how far into the game you've gone
 * - end game (which involves bunch of other stuff, like stopping the timer, showing results´etc)
 * 
 * checks if we solved all problems
 * - save the score (which is equal to number of problems)
 * - display results
 * - make the problem, for example "1+1" do a little victory bounce
 * 
 * if the answer is incorrect, and you have solved for example 2 problems,
 * then we need to save 2 to the result (it's your final score).
 * 
 * then we end the game and ask if the player wants to play again.
 */
var input;
function handleEnterPress(e) {
  if (e.key === "Enter") {
    input = Number(e.target.value); // this converts input to number, if possible. Otherwise input will be NaN.
    if (isNeitherNumberNorInteger(input)) {
      alert("Please enter a number ");
      e.target.value = "";
      return;
    }
    if (input == problems[problemNumber].correctAnswer) {
      clearInputField(e);
      problemNumber++;
      if (problemNumber == problems.length) {
        // alert("won round");
        addToResults(problemNumber); // for example, if we solved 3 problems, we get the score 3.
        displayPreviousResults();
        endGame();
        bounce($("#problem"));
      }
      incrementProgressValue(problemNumber);
      displayProblem(problemNumber);
      startTimer(secPerProblem);
    } else {
      if (problemNumber > 0) {
        addToResults(problemNumber);
        displayPreviousResults();
      }

      endGame();
      askIfPlayerWantsToPlayAgain(problemNumber);
    }
  }
}

const clearInputField = (e) => {
  e.target.value = "";
};

//const displayNextProblem = () => {};

// Just a little check for user input
function isNeitherNumberNorInteger(input) {
  return Number.isNaN(input) || !Number.isInteger(input);
}

// Start reaction to enter key press
function startReactingToEnterKey() {
  userAnswer.addEventListener("keyup", handleEnterPress);
}

// Stop reacting to enter key press
function stopReactingToEnterKey() {
  userAnswer.removeEventListener("keyup", handleEnterPress);
}

// Note: threeSecondsCountdown() acts as a startRound function.
const newRoundButton = document.getElementById("new-round-button");
newRoundButton.addEventListener("click", () => {
  startRoundAfterThreeSeconds();
  // startRound();
});

// pretty self explanatory.
function askIfPlayerWantsToPlayAgain(questionIndex) {
  var playAgain = confirm("you've scored " + questionIndex + " play again?");
  if (playAgain) startRoundAfterThreeSeconds();
}



// ---------------- PREVIOUS RESULT SECTION ---------------- //

/**
 * We want to date-stamp all results with this.
 * @returns
 */
function now() {
  d = new Date();
  year = d.getFullYear();
  month = d.getMonth() + 1;
  day = d.getDate();
  hours = d.getHours();
  minutes = d.getMinutes();
  seconds = d.getSeconds();

  paddedMonth = month < 10 ? `0${month}` : month;
  paddedDay = day < 10 ? `0${day}` : day;
  paddedHours = hours < 10 ? `0${hours}` : hours;
  paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  paddedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  return `${year}${paddedMonth}${paddedDay} ${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
}

/**
 * We add this result to previous results.
 */
function addToResults(result) {
  if (result > 0)
    previousResults.push(
      now() + " Score: " + result + " Num of digits: " + numOfDigits + " Speed: " + getTimePassed()
    );
}

/**
 * after game ends, show previous results
 * 
 * Which means looping over "previousResults" array and
 * displaying each of the elements into a list * 
 * 
 */
function displayPreviousResults() {
  document.querySelector(".previousResultList").innerHTML = "";
  let previousResults_dom = document.querySelector(".previousResultList");

  let lastEntry = null;
  previousResults.forEach((entry) => {
    var li_dom = document.createElement("li");
    lastEntry = li_dom;
    li_dom.innerText = entry; 
    previousResults_dom.appendChild(li_dom);
  });

  blink(lastEntry);
}

// ---------------- HOVER SECTION ---------------- //

/**
 * Select info box where we will show countdown 3-2-1- 
 */
const infoBox = newRoundButton.querySelector(".info-box");

/**
 * Show additinal info when hovering
 */
newRoundButton.addEventListener("mouseover", () => {
  $(infoBox).show(); // JQuery
});

/**
 * Hide additional info when leaving
 */
newRoundButton.addEventListener("mouseout", hideBox);

function hideBox() {
  $(infoBox).hide(); // JQuery
}

// ---------------- COUNTDOWN TO START GAME ---------------- //
/**
 * Here we have an additional timer. But this timer is meant to
 * always start from 3 and count down to 0. Once it reaches zero
 * a new game rond will begin (see tick3())
 */

var interval3;
var secondsLeft3;

/*
calls itself every second, unless time is over, then stop timers and stopwatch.
but most importantly this is the three second timer before starting a new round, therefore
startRound is called here. 
*/
function tick3() {
  if (secondsLeft3 > 0) {
    updateThreeSecondDisplay(secondsLeft3--);

    interval3 = setTimeout(tick3, 1000);
  } else {
    stopTimer();
    stopTimer3();
    stop_sw();
    startRound();
  }
}

/**
 * Game is about to start so remove distractions 
 * and start three seconds countdown
 */
function startRoundAfterThreeSeconds() {
  toggleDistractions(true);
  incrementProgressValue(0);
  infoBox.style.display = "block";
  selectInput();
  newRoundButton.removeEventListener("mouseout", hideBox);
  clearInterval(interval);
  stop_sw();
  clearTimeout(interval3);
  secondsLeft3 = 3;
  updateThreeSecondDisplay(secondsLeft3);
  interval3 = setTimeout(tick3, 1000);
}

/**
 * This hides the countdown timer. Useful so that it doesn't bother
 * the player trying to play the game. 
 */
function stopTimer3() {
  clearTimeout(interval3);
  updateThreeSecondDisplay("Go go go");
  infoBox.style.display = "none";
  newRoundButton.addEventListener("mouseout", hideBox);
}

function updateThreeSecondDisplay(text) {
  infoBox.innerText = text;
}

// ---------------- PROGRESS BAR ---------------- //

/**
 * Setting up the progress bar so that shows 100% progress done
 * after we solved all problems.
 */
var progressBar = document.getElementById("progress");
var progressValueText = document.getElementById("progressInfo");
progressBar.max = numberOfProblems;



/**
 * Change progress bar value
 * @param {*} value 
 */
function incrementProgressValue(value) {
  progressBar.setAttribute("value", value);
}


/**
 * Show changes made with the function above.
 */
function displayProgressValue() {
  progressValueText.innerText = progressBar.getAttribute("value");
}

/**
 * This is a game, we don't need to open any context menu.
 */
document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

/**
 * This is a game, we don't need to select any text in this game.
 */
document.addEventListener("selectstart", (e) => {
  e.preventDefault();
});

// ---------------- THEME STUFF ---------------- //
problemWrapper = document.findElementById("problemWrapper");

/**
 * Hides previous results so they don't distract you
 * if the game is in progress.
 * @param {Boolean} gameInProgress 
 */
function toggleDistractions(gameInProgress) {
  unsetVictoryBackground();

  if (gameInProgress) {
    $(".previousResultList").toggle(false);
    unDimProgressBar();
  } else {
    $(".previousResultList").toggle(true);
    dimProgressBar();
  }
}

/**
 * Think: 100% visible after 3 seconds.
 */
function unDimProgressBar() {
  $("#progress").fadeTo(3000, 1);
}

/**
 * Think 50% visible after 3 seconds.
 */
function dimProgressBar() {
  $("#progress").fadeTo(3000, 0.5);
}




// ----------------------------------------------------------------

/**
 * do a little victory bounce at the end. It's just an up and down
 * movement where it moves slowly up, then faster down. Simulating
 * loss of bouncing force by first having it bounce 60 pixels
 * and then 30. Swing simply changes the look of the movement. I am 
 * not sure it changes it for the better though.
 * 
 * @param {} element
 */
function bounce(element) {
  setVictoryBackground();
  setTimeout;

  $(element).css({ position: "relative" });

  $(element)
    .animate({ top: "-=60" }, 400, "swing")
    .animate({ top: "+=60" }, 200, "swing")
    .animate({ top: "-=30" }, 400, "swing")
    .animate({ top: "+=30" }, 200, "swing")
    .promise()
    .done(function () {
      askIfPlayerWantsToPlayAgain(problemNumber);
    });
}

/***
 * Picks the background, fades it out, changes the color while it is still invisible,
 * and then fades it in again. Might seem a bit complex.. all it really
 * does is change the background to green, essentially. 
 */
function setVictoryBackground() {
  $("#background").fadeOut(0, function () {
    $(this).css("background-color", "palegreen").fadeIn(1000);
  });
}

// the victory background must be removed when new game starts.
function unsetVictoryBackground() {
  $("#background").fadeOut(1000);
}

/**
 * Mekes an element blink by fading it in and out. In the end it fades in just in case, 
 * so it wont stay faded out.
 * @param {*} element
 */
function blink(element) {
  $(element)
    .fadeToggle(300)
    .fadeToggle(100)
    .fadeToggle(300)
    .fadeToggle(100)
    .fadeIn(300);
}
