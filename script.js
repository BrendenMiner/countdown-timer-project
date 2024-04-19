document.addEventListener("DOMContentLoaded", () => {
  //*select elements
  const startButton = document.getElementById("start-countdown");
  const pauseButton = document.getElementById("pause-countdown");
  const resumeButton = document.getElementById("resume-countdown");
  const cancelButton = document.getElementById("cancel-countdown");
  //!Initial values
  let countdownTimer;
  let endTime;
  // function to update the display
  function updateDisplay(time) {
    //!get days
    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    //!get hours
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    //!get minutes
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    //!get seconds
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    document.getElementById("days").textContent = days
      .toString()
      .padStart(2, "0");
    document.getElementById("hours").textContent = hours
      .toString()
      .padStart(2, "0");
    document.getElementById("minutes").textContent = minutes
      .toString()
      .padStart(2, "0");
    document.getElementById("seconds").textContent = seconds
      .toString()
      .padStart(2, "0");
  }
  //function to reset update the display
  function resetDisplayButtons() {
    document.getElementById("target-date").value = "";
    document.getElementById("days").textContent = "";
    document.getElementById("hours").textContent = "";
    document.getElementById("minutes").textContent = "";
    document.getElementById("seconds").textContent = "";
    startButton.disabled = false;
    pauseButton.disabled = true;
    resumeButton.disabled = true;
    cancelButton.disabled = true;
  }
  //function to start the countdown
  function startCountDown(duration, isResuming = false) {
    if (!isResuming) {
      endTime = Date.now() + duration;
    }
    countdownTimer = setInterval(() => {
      const now = Date.now();
      const timeLeft = endTime - now;
      if (timeLeft <= 0) {
        clearInterval(countdownTimer);
        displayMessage("Countdown Finished");
        localStorage.removeItem("countdownTarget");
        resetDisplayButtons();
        return;
      }
      updateDisplay(timeLeft);
      pauseButton.disabled = false;
      cancelButton.disabled = false;
    }, 1000);
  }
  //function to display the message
  function displayMessage(message) {
    const disaply = document.getElementById("timer-display");
    disaply.textContent = message;
  }
  //function to add event listeners to the buttons
  //!Start button
  startButton.addEventListener("click", function () {
    const targetDatevalue = document.getElementById("target-date").value;
    if (targetDatevalue) {
      const targetDate = new Date(targetDatevalue);
      const now = new Date();
      if (targetDate > now) {
        const duration = targetDate - now;
        localStorage.setItem("countdownTarger", targetDate.toString());
        startCountDown(duration);
        startButton.disabled = true;
        pauseButton.disabled = false;
        resumeButton.disabled = true;
        cancelButton.disabled = false;
      } else {
        alert("Please select a future date and time");
      }
    } else {
      alert("Please select a future date and time");
    }
  });
  //!Pause button
  pauseButton.addEventListener("click", function () {
    clearInterval(countdownTimer);
    pauseButton.disabled = true;
    resumeButton.disabled = false;
  });
  //!Resume button
  resumeButton.addEventListener("click", function () {
    const duration = endTime - Date.now();
    startCountDown(duration, true);
    pauseButton.disabled = false;
    resumeButton.disabled = true;
  });

  //!Cancel button
  cancelButton.addEventListener("click", function () {
    clearInterval(countdownTimer);
    localStorage.removeItem("countdownTarget");
    resetDisplayButtons();
  });
  //function to load and auto-start the countdown if a saved target exists
  const savedDate = localStorage.getItem("countdownTarget");
  if (savedDate) {
    const targetDate = new Date(savedDate);
    const now = new Date();
    if (targetDate > now) {
      const duration = targetDate - now;
      startCountDown(duration);
      startButton.disabled = true;
      pauseButton.disabled = false;
      cancelButton.disabled = false;
    } else {
      localStorage.removeItem("countdownTarget");
      resetDisplayButtons();
    }
  }
});
