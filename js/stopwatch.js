import { fillingNumbers } from "./helpers/fillingNumbers.js";
import { $toggleSwitchSlider } from "./toggleSwitch.js";
import { timerStyles } from "./helpers/timerStyles.js";
import { toggleButtonBackground } from "./helpers/toggleButtonBackground.js";
import { scrollIntoContainers } from "./helpers/scrollIntoContainers.js";
import * as timer from "./timer.js";

// Model
// Creating model of stopwatch object
const stopWatch = {
  seconds: 0,
  miliseconds: 0,
  minutes: 0,
  waitingForPause: false,
  countdown: "off",
  wasOn: false,
};

// Copying stopwatch object
const segmentStopWatch = Object.assign({}, stopWatch);

// Define variables that will contain setInterval values;
let interval;
let segmentInterval;

// Creating counter for segmentText
let segmentCounter = 0;

// Controller

// Get access for buttons and adding EventListener
const startButton = document.getElementById("start");
startButton.innerHTML = "<img src='images/play.png'>";
startButton.style.cursor = "pointer";
startButton.addEventListener("click", StartCountdown);

const resetButton = document.getElementById("reset");
resetButton.innerHTML =
  "<img style='opacity: 0.5;' src='images/undo-black.png'>";
resetButton.addEventListener("click", resetCountdown);

const segmentButton = document.getElementById("segment");
segmentButton.innerHTML =
  "<img style='opacity: 0.5;' src='images/stopwatch-black.png'>";
segmentButton.addEventListener("click", createSegment);

const line = document.getElementById("line");

// Function handles the countdown process
function StartCountdown() {
  const { waitingForPause } = stopWatch;

  // If stopwatch object not waiting for pause then start the countdown
  if (!waitingForPause) {
    segmentStopWatch.waitingForPause = true;
    segmentButton.disabled = false;
    stopWatch.waitingForPause = true;
    stopWatch.countdown = "on";
    stopWatch.wasOn = true;
    startButton.value = "on";
    startButton.innerHTML =
      "<img style='margin-left: 0px;' src='images/pause.png'>";
    resetButton.innerHTML =
      "<img style='opacity: 0.5;' src='images/undo-black.png'>";
    line.style.animation = "circle 60.5s linear infinite";
    segmentButton.style.cursor = "pointer";
    resetButton.style.color = "default";
    handleCountdown("stopWatch");

    // If segmentButton is pressed then start the countdown for copied stopwatch object(segmentStopWatch)
    if (segmentButton.value === "on") {
      handleCountdown("segment");
    }

    if ($toggleSwitchSlider.val() === "dark") {
      segmentButton.innerHTML =
        "<img style='opacity: 1;' src='images/stopwatch-white.png'>";
      resetButton.innerHTML =
        "<img style='opacity: 0.5;' src='images/undo-white.png'>";
    } else {
      segmentButton.innerHTML =
        "<img style='opacity: 1;' src='images/stopwatch-black.png'>";
      resetButton.innerHTML =
        "<img style='opacity: 0.5;' src='images/undo-black.png'>";
    }

    /* Else if original stopwatch object waiting for pause - stop the countdown and 
    invert both objects property values besides countdown property */
  } else if (waitingForPause) {
    handleWaitingForPause();
  }
}

function handleWaitingForPause() {
  if (!stopWatch.wasOn) {
    return;
  }
  segmentStopWatch.waitingForPause = false;
  segmentButton.disabled = true;
  startButton.value = "off";
  stopWatch.waitingForPause = false;
  resetButton.disabled = false;
  startButton.innerHTML = "<img src='images/play.png'>";
  line.style.animationPlayState = "paused";
  segmentButton.style.cursor = "default";
  resetButton.style.cursor = "pointer";
  clearInterval(interval);
  clearInterval(segmentInterval);
  if ($toggleSwitchSlider.val() === "dark") {
    segmentButton.innerHTML =
      "<img style='opacity: 0.5;' src='images/stopwatch-white.png'>";
    resetButton.innerHTML =
      "<img style='opacity: 1;' src='images/undo-white.png'>";
  } else if ($toggleSwitchSlider.val() === "light") {
    segmentButton.innerHTML =
      "<img style='opacity: 0.5;' src='images/stopwatch-black.png'>";
    resetButton.innerHTML =
      "<img style='opacity: 1;' src='images/undo-black.png'>";
  }
}

// Stops the countdown if user switch pages
window.addEventListener("blur", handleWaitingForPause);

// Function gets access for interval variables, assign its values to setInterval function and invoke renderTime
function handleCountdown(value) {
  if (value === "stopWatch") {
    interval = setInterval(function () {
      stopWatch.miliseconds += 1;
      if (stopWatch.miliseconds === 100) {
        stopWatch.seconds += 1;
        stopWatch.miliseconds = 0;
      }
      if (stopWatch.seconds === 60) {
        stopWatch.minutes += 1;
        stopWatch.seconds = 0;
      }
      renderStopWatch();
    }, 10);
  } else {
    segmentInterval = setInterval(function () {
      segmentStopWatch.miliseconds += 1;
      if (segmentStopWatch.miliseconds === 100) {
        segmentStopWatch.seconds += 1;
        segmentStopWatch.miliseconds = 0;
      }
      if (segmentStopWatch.seconds === 60) {
        segmentStopWatch.minutes += 1;
        segmentStopWatch.seconds = 0;
      }
      renderStopWatch();
    }, 10);
  }
}

function createSegment() {
  // Get access for segment-container and fill it dynamically created divs
  const secondSegmentInnerContainer = document.createElement("div");
  const segmentContainer = document.getElementById("segment-container");
  const secondSegment = document.createElement("div");
  const segment = document.createElement("div");
  let secondSegmentText = document.createElement("p");
  // For every segmentButton click increment segmentCounter by 1
  segmentCounter += 1;

  // Invoking functions that format both object properties to "00:00.00" string and assign returned strings as values for dynamically created divs
  segment.innerHTML =
    checkMinutes("stopWatch") +
    ":" +
    checkSeconds("stopWatch") +
    "." +
    checkMiliseconds("stopWatch");
  secondSegment.innerHTML =
    checkMinutes("segment") +
    ":" +
    checkSeconds("segment") +
    "." +
    checkMiliseconds("segment");

  /* Checks if copied stopwatch object property are equal to zero in the moment of pressing segmentButton. If yes then first dynamically created div will contain same values for both stopwatch objects */
  if (secondSegment.innerHTML === "00:00.00") {
    secondSegment.innerHTML = segment.innerHTML;
  }

  /* Checking the segmentButton value. In both cases appending stopwatch objects. If segmentButton is already pressed - reset properties of copied stopWatch object but not stopping the countdown*/
  if (segmentButton.value === "off") {
    secondSegmentInnerContainer.appendChild(secondSegmentText);
    secondSegmentInnerContainer.appendChild(secondSegment);
    secondSegmentInnerContainer.classList.add("segment-div");
    secondSegmentInnerContainer.style.animation = "approach 1s ease-in-out";
    segmentContainer.prepend(secondSegmentInnerContainer);
    handleCountdown("segment");
  }
  if (segmentStopWatch.countdown === "on") {
    secondSegmentInnerContainer.appendChild(secondSegmentText);
    secondSegmentInnerContainer.appendChild(secondSegment);
    secondSegmentInnerContainer.classList.add("segment-div");
    secondSegmentInnerContainer.style.animation = "approach 1s ease-in-out";
    segmentContainer.prepend(secondSegmentInnerContainer);
    resetSegmentStopWatch();
  }
  secondSegment.appendChild(segment);
  secondSegmentText.innerText = `Segment ${segmentCounter}`;
  segmentStopWatch.waitingForPause = true;
  segmentStopWatch.countdown = "on";
  segmentButton.value = "on";

  if (segmentCounter === 3) {
    segmentContainer.classList.add("reveal-scrollbar");
  }
}

// Functions getting access for both objects and format its property values
function checkMiliseconds(value) {
  if (value === "stopWatch") {
    const { miliseconds } = stopWatch;
    if (miliseconds < 10) {
      return "0" + stopWatch.miliseconds;
    }
    return stopWatch.miliseconds;
  } else {
    const { miliseconds } = segmentStopWatch;
    if (miliseconds < 10) {
      return "0" + segmentStopWatch.miliseconds;
    }
    return segmentStopWatch.miliseconds;
  }
}

function checkSeconds(value) {
  if (value === "stopWatch") {
    const { seconds } = stopWatch;
    if (seconds < 10) {
      return "0" + stopWatch.seconds;
    }
    return stopWatch.seconds;
  } else {
    const { seconds } = segmentStopWatch;
    if (seconds < 10) {
      return "0" + segmentStopWatch.seconds;
    }
    return segmentStopWatch.seconds;
  }
}

function checkMinutes(value) {
  if (value === "stopWatch") {
    const { minutes } = stopWatch;
    if (minutes < 10) {
      return "0" + stopWatch.minutes;
    }
    return stopWatch.minutes;
  } else {
    const { minutes } = segmentStopWatch;
    if (minutes < 10) {
      return "0" + segmentStopWatch.minutes;
    }
    return segmentStopWatch.minutes;
  }
}

// Reset the stopWatch properties
function resetStopWatch() {
  stopWatch.seconds = 0;
  stopWatch.miliseconds = 0;
  stopWatch.minutes = 0;
  stopWatch.countdown = "off";
}

// Reset the copied stopwatch properties
function resetSegmentStopWatch() {
  segmentStopWatch.seconds = 0;
  segmentStopWatch.miliseconds = 0;
  segmentStopWatch.minutes = 0;
  segmentStopWatch.countdown = "off";
}

// Reset all values
function resetCountdown() {
  const segmentContainer = document.getElementById("segment-container");
  const { waitingForPause } = stopWatch;
  if ($toggleSwitchSlider.val() === "dark") {
    resetButton.innerHTML =
      "<img style='opacity: 0.5;' src='images/undo-white.png'>";
  } else {
    resetButton.innerHTML =
      "<img style='opacity: 0.5;' src='images/undo-black.png'>";
  }
  if (!waitingForPause) {
    stopWatch.wasOn = false;
    line.style.animation = "none";
    segmentCounter = 0;
    startButton.value = "null";
    segmentButton.value = "off";
    segmentContainer.innerHTML = "";
    segmentContainer.classList.remove("reveal-scrollbar");
    resetButton.disabled = true;
    resetButton.style.cursor = "default";
    resetStopWatch();
    resetSegmentStopWatch();
  }
  renderStopWatch();
}

// View
function renderStopWatch() {
  const stopWatchDisplay = document.getElementById("display");
  const segmentDisplay = document.getElementById("segment-display");

  // Displays formatted values in both input elements
  stopWatchDisplay.value =
    checkMinutes("stopWatch") +
    ":" +
    checkSeconds("stopWatch") +
    "." +
    checkMiliseconds("stopWatch");
  segmentDisplay.value = "";
  if (segmentButton.value === "on") {
    segmentDisplay.value =
      checkMinutes("segment") +
      ":" +
      checkSeconds("segment") +
      "." +
      checkMiliseconds("segment");
  }
}

timerStyles();
fillingNumbers();
renderStopWatch();
toggleButtonBackground()
scrollIntoContainers()
timer.numberPicker();
timer.renderTimerView();
timer.handleUserInteractionsWithTimer();
