let timerInterval;
let remainingSeconds = 300; // Start with 60 seconds

const timerDisplay = document.querySelector(".timer");

export const startTimer = (onEnd, user, ancestoryMatrix, paths) => {
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    remainingSeconds--;
    updateTimerDisplay();

    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      onEnd(user, ancestoryMatrix, paths);
    }
  }, 1000);
};

export const addSeconds = (seconds) => {
  remainingSeconds += seconds;
  updateTimerDisplay();
};

const updateTimerDisplay = () => {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  timerDisplay.textContent = `${pad(minutes)}:${pad(seconds)}`;
};

const pad = (number) => {
  return number.toString().padStart(2, "0");
};
