import { trieNode, add, fetchWord } from "./trie.js";
import { gridNode, setUpGrid, findWords } from "./gridNode.js";
import { modal, timer } from "./util.js";

let globalDictionary = null;

async function getDictionay() {
  const response = await fetch("dictionary.txt");
  const data = await response.text();
  globalDictionary = data.split(/\r?\n/).filter((word) => {
    return word.length > 2;
  });
}

async function game() {
  await getDictionay();
  const root = new trieNode(null);
  for (const item of globalDictionary) add(item, 0, root);

  modal();

  const playButton = document.querySelector(".play-music");
  const pauseButton = document.querySelector(".pause-music");

  playButton.addEventListener("click", () => {
    music.play();
  });

  pauseButton.addEventListener("click", () => {
    music.pause();
  });

  let [grid, completeNodes] = setUpGrid(root);

  //testing the loading screen
  window.addEventListener("load", function () {
    console.log("let's make sure this is loading first");
  });

  timer(grid, completeNodes);
}

export default game;
