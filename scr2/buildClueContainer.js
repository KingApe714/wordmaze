import { buildBoard } from "./buildBoard.js";
import { root } from "./trie.js";
export const gameBoard = buildBoard();
const innerClueContainer = document.querySelector(".inner-clue-container");

console.log(innerClueContainer);
console.log(gameBoard);
console.log(root);
class AncestoryNode {
  constructor(i, j, div) {
    this.i = i;
    this.j = j;
    this.gameDiv = div;
    this.children = {};
    this.word = null;
    this.clueDiv = null;
    this.found = false;
  }
}

const buildAncestoryNode = () => {
  for (let i = 0; i < 4; i += 1) {
    for (let j = 0; j < 4; j += 1) {
      const tile = gameBoard[i][j];
      const node = AncestoryNode(i, j, tile);
    }
  }
};
