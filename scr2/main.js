import { buildBoard } from "./buildBoard.js";

const { currentMatrix, foundWords } = buildBoard();
const innerGameContainer = document.querySelector(".inner-game-container");
const gameBoard = [];

for (const arr of currentMatrix) {
  const row = document.createElement("div");
  row.className = "game-row";
  const inner = [];

  for (const char of arr) {
    const tile = document.createElement("div");
    tile.className = "game-tile";
    tile.innerHTML = char;

    inner.push(tile);
    row.appendChild(tile);
  }

  gameBoard.push(inner);
  innerGameContainer.appendChild(row);
}

export default gameBoard;
