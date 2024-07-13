let timerInterval;
let remainingSeconds = 60; // Start with 60 seconds

const timerDisplay = document.querySelector(".timer");

export const startTimer = () => {
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    remainingSeconds--;
    updateTimerDisplay();

    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
    }
  }, 1000);
};

const updateTimerDisplay = () => {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  timerDisplay.textContent = `${pad(minutes)}:${pad(seconds)}`;
};

const pad = (number) => {
  return number.toString().padStart(2, "0");
};
