import { buildTrie } from "./trie.js";
import { buildBoard } from "./buildBoard.js";
import { buildAncestoryNode } from "./buildClueContainer.js";
import { gamePlay } from "./buildGamePlay.js";
import definitions from '../src/definitions.json' with { type: "json" };

const root = buildTrie(definitions);
const gameBoard = buildBoard(root);
const ancestoryMatrix = buildAncestoryNode(gameBoard, root);

gamePlay(ancestoryMatrix);