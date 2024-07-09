export const gamePlay = (ancestoryMatrix) => {
  const gameBoard = document.querySelector(".inner-game-container");
  console.log(ancestoryMatrix);
  console.log(gameBoard);

  gameBoard.addEventListener("mousedown", (e) => {
    const tile = e.target;
    e.testing = "testing";
    console.log(e);
    console.log(tile);
  });
};
