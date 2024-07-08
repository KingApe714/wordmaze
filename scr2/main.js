import { buildTrie } from "./trie.js";
import { buildBoard } from "./buildBoard.js";
import { buildAncestoryNode } from "./buildClueContainer.js";
import { gamePlay } from "./buildGamePlay.js";
import definitions from '../src/definitions.json' with { type: "json" };

const root = buildTrie(definitions);
const gameBoardTest = buildBoard(root);
const ancestoryMatrix = buildAncestoryNode(gameBoardTest, root);

gamePlay(ancestoryMatrix);