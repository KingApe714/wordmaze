import { buildTrie } from "./trie.js";
import { buildBoard } from "./buildBoard.js";
import { buildAncestoryNode } from "./buildClueContainer.js";
import { gamePlay } from "./buildGamePlay.js";
import { startTimer } from "./timer.js";
import definitions from '../src/definitions.json' with { type: "json" };

// I believe that I need to create a user object that will gather the points and the demerites the user has gained throughout the game
const user = {
  points: 0,
  demerits: 0
}
const root = buildTrie(definitions);
const gameBoard = buildBoard(root);
buildAncestoryNode(gameBoard, root, definitions);
gamePlay(gameBoard, user);
startTimer();