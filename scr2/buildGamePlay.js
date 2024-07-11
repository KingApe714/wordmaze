export const gamePlay = (ancestoryMatrix) => {
  const gameBoard = document.querySelector(".inner-game-container");
  console.log(ancestoryMatrix);

  // it seems that I have to have the mouse down event on the gameContainer
  // my next question is can the game container listen for a mouse down while the tiles are listening for a mouse down?
  gameBoard.addEventListener("mousedown", (e) => {
    e.preventDefault();

    for (let i = 0; i < 4; i += 1) {
      for (let j = 0; j < 4; j += 1) {
        const node = ancestoryMatrix[i][j];
        node.active = true;
      }
    }
  });

  gameBoard.addEventListener("mouseup", (e) => {
    e.preventDefault();

    const svg = document.getElementById("line-canvas");
    svg.innerHTML = "";

    for (let i = 0; i < 4; i += 1) {
      for (let j = 0; j < 4; j += 1) {
        const node = ancestoryMatrix[i][j];
        node.active = false;
        node.visited = false;
        node.lastVisited = false;
        node.current = node;
        node.innerGameDiv.classList.remove("active-inner-game-tile");
      }
    }
  });
};
