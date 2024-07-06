import { root } from "./trie.js";
import { buildBoard } from "./buildBoard.js";
import { buildAncestoryNode } from "./buildClueContainer.js";
const gameBoard = buildBoard(root);
const ancestoryMatrix = buildAncestoryNode(gameBoard, root);

console.log(ancestoryMatrix);
