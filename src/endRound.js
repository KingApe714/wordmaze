export const endRound = (user, ancestoryMatrix) => {
  console.log(user.points);
  console.log(user);
  console.log(ancestoryMatrix);
  // const modalBtn = document.querySelector(".modal-button");
  const modalBg = document.querySelector(".modal-bg");
  // const modalClose = document.querySelector(".modal-close");
  // const modalTitle = document.querySelector(".modal-title");
  const modalInner = document.querySelector(".modal-inner");
  modalBg.classList.add("bg-active");

  modalInner.innerHTML += user.demerits.nonwords;
  modalInner.innerHTML += user.demerits.foundWords;

  // from here i want to display to the user all of the board data and their points and demerites
  const gameBoard = document.createElement("div");
  gameBoard.className = "end-game-board";

  for (let i = 0; i < 4; i += 1) {
    const innerRow = document.createElement("div");
    innerRow.className = "end-board-inner-row";

    for (let j = 0; j < 4; j += 1) {
      const node = ancestoryMatrix[i][j];
      const tile = document.createElement("div");
      tile.innerHTML = node.char;
      tile.className = "game-tile end-game-tile";

      const innerTile = document.createElement("div");
      innerTile.className = "inner-game-tile";

      if (node.complete) {
        innerTile.classList.add("found-inner-game-tile");
      } else if (node.deadNode) {
        tile.classList.add("dead-game-tile");
      } else {
        const percentage = node.foundWordCount / node.wordCount;
        const shading = 0.35 * percentage;
        innerTile.style.backgroundColor = `rgba(0, 230, 65, ${shading})`;
      }

      tile.appendChild(innerTile);
      innerRow.appendChild(tile);

      console.log(node);
    }

    gameBoard.appendChild(innerRow);
  }

  modalInner.appendChild(gameBoard);
};
