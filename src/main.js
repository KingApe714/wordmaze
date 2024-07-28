import { buildTrie } from "./trie.js";
import { buildBoard } from "./buildBoard.js";
import { gamePlay } from "./buildGamePlay.js";
import { startTimer } from "./timer.js";
import { endRound } from "./endRound.js";

const fetchDefinitions = async () => {
  const response = await fetch("./json/definitions.json");
  const definitions = await response.json();

  return definitions;
};

const fetchPoints = async () => {
  const response = await fetch("./json/points.json");
  const points = await response.json();

  return points;
};

const initGame = async () => {
  const definitions = await fetchDefinitions();
  const points = await fetchPoints();
  const root = buildTrie(definitions);
  const { ancestoryMatrix, paths } = buildBoard(root, definitions);
  const user = {
    activeBoard: false,
    lastVisitedTile: null,
    firstVisitedTile: null,
    visited: 1n,
    lines: [],
    path: [],
    points: 0,
    demerits: {
      nonwords: [],
      foundWords: [],
    },
  };

  const arr = [];

  for (const [key, val] of paths) {
    arr.push(val.word);
  }

  console.log(arr);

  gamePlay(ancestoryMatrix, user, paths, points);
  startTimer(endRound, user, ancestoryMatrix, paths);
};

// console.log(document.styleSheets[2].cssRules);
initGame();
