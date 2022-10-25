// Model
const stopWatch = {
  seconds: 0,
  miliseconds: 0,
  waitingForPause: false,
};

let interval;

// Controller
const startButton = document.getElementById("start");
startButton.addEventListener("click", StartCountdown);

const resetButton = document.getElementById("reset");
resetButton.addEventListener("click", resetCountdown);

function StartCountdown() {
  const { waitingForPause } = stopWatch;
  if (!waitingForPause) {
    stopWatch.waitingForPause = true;
    handleCountdown();
  } else if (waitingForPause) {
    clearInterval(interval);
    stopWatch.waitingForPause = false;
    console.log(stopWatch.waitingForPause);
  }
}

function handleCountdown() {
  interval = setInterval(function () {
    stopWatch.miliseconds += 1;
    if(stopWatch.miliseconds === 10) {

    } else if(stopWatch.miliseconds === 100) {
      stopWatch.seconds += 1;
      stopWatch.miliseconds = 0;
    }
    renderTime();
  }, 10);
  console.log(stopWatch.waitingForPause);
}

function resetCountdown() {
  const { waitingForPause } = stopWatch;
  if(!waitingForPause) {
    stopWatch.seconds = 0;
    stopWatch.miliseconds = 0;
  }
  renderTime();
}

function checkSeconds() {
  const { seconds } = stopWatch;
  if (seconds < 10) {
    return "0" + stopWatch.seconds;
  } else {
    return stopWatch.seconds;
  }
}

function checkMiliseconds() {
  const { miliseconds } = stopWatch;
  if (miliseconds < 10) {
    return "0" + stopWatch.miliseconds;
  } else {
    return stopWatch.miliseconds;
  }
}

// View
function renderTime() {
  const timeDisplay = document.getElementById("display");
  timeDisplay.value = checkSeconds() + "." + checkMiliseconds();
  timeDisplay.style.textAlign = "end";
}

renderTime();
