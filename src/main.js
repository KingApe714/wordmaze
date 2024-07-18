import { buildTrie } from "./trie.js";
import { buildBoard } from "./buildBoard.js";
import { buildAncestoryNode } from "./buildClueContainer.js";
import { gamePlay } from "./buildGamePlay.js";
import { startTimer } from "./timer.js";
import { endRound } from "./endRound.js";

// I believe that I need to create a user object that will gather the points and the demerites the user has gained throughout the game
// the demerits should have the path as the key and the amount of points it costed them
// I should also create a demerits.json to easily compute this
// I need a way to capture that paths that the user creates to stringify it and use it as a key then have the value be the demerit
// at touchend_mouseup I can check to see if we have found a word, if not, then use the line to score the demerit, and if it is a word the user found already we can

// const openFullscreen = () => {
//   if (document.documentElement.requestFullscreen) {
//     document.documentElement.requestFullscreen();
//   } else if (document.documentElement.mozRequestFullScreen) {
//     /* Firefox */
//     document.documentElement.mozRequestFullScreen();
//   } else if (document.documentElement.webkitRequestFullscreen) {
//     /* Chrome, Safari and Opera */
//     document.documentElement.webkitRequestFullscreen();
//   } else if (document.documentElement.msRequestFullscreen) {
//     /* IE/Edge */
//     document.documentElement.msRequestFullscreen();
//   }
// };

// Call this function, for example, on a button click
// document
//   .querySelector(".fullscreen-btn")
//   .addEventListener("click", openFullscreen);

const fetchDefinitions = async () => {
  const response = await fetch("./json/definitions.json");
  const definitions = await response.json();

  return definitions;
};

const initGame = async () => {
  const definitions = await fetchDefinitions();

  const user = {
    points: 0,
    demerits: {
      nonwords: [],
      foundWords: [],
    },
  };

  const root = buildTrie(definitions);
  const gameBoard = buildBoard(root);
  buildAncestoryNode(gameBoard, root, definitions);
  gamePlay(gameBoard, user);
  startTimer(endRound, user, gameBoard);
};

initGame();