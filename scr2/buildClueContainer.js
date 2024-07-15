import { AncestoryNode } from "./ancestor.js";
// import points from './points.json' with { type: 'json' }

const points = {
  1: 100,
  2: 400,
  3: 800,
  4: 1500,
  5: 2200,
  6: 3200,
  7: 4300,
  8: 5500,
  9: 7000,
  10: 8500,
  11: 10200,
  12: 12100,
  13: 14100,
  14: 16300,
  15: 18600,
  16: 21100,
  17: 23700,
  18: 26500,
  19: 29400,
  20: 32500,
  21: 35700,
  22: 39100,
  23: 42600,
  24: 46200,
  25: 50000,
};

const buildClueDiv = (word, visited, board, definition) => {
  const innerClueContainer = document.querySelector(".inner-clue-container");
  const definitionsContainer = document.querySelector(".definitions-container");
  const wordContainer = document.createElement("div");

  wordContainer.className = "clue-word-container";
  wordContainer.addEventListener("mousedown", (e) => {
    e.preventDefault();
    definitionsContainer.innerHTML = definition;
  });

  for (let i = 0; i < word.length; i += 1) {
    const char = word[i];
    const charContainer = document.createElement("div");
    charContainer.className = "clue-char-container";
    charContainer.innerHTML = char;
    wordContainer.appendChild(charContainer);

    // create reference between char-clue-div and root ancestory node
    const [idx, jdx] = visited[i].split(",");
    const rootAncestor = board[idx][jdx];
    rootAncestor.clueCharContainers.push(charContainer);
  }

  innerClueContainer.appendChild(wordContainer);
  return wordContainer;
};

const isValid = (i, j, visited, board, trie) => {
  return (
    i >= 0 &&
    i < 4 &&
    j >= 0 &&
    j < 4 &&
    !visited.includes(`${i},${j}`) &&
    board[i][j].char in trie.children
  );
};

const isInbounds = (i, j) => {
  return i >= 0 && i < 4 && j >= 0 && j < 4;
};

const coords = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
];

// I should find a way to scale up the points starting from 100 for 1 letter words and ending at about 50_000 for 25 letter words. the last two digits should end in zero. this should be a curve

// visited has the path with all the root ancestory nodes that I need to reference
const bfs = (gameBoard, ancNode, trieNode, idx, jdx, definitions) => {
  const queue = [[trieNode, ancNode, idx, jdx, [`${idx},${jdx}`]]];
  const deadLeafNodes = [];
  let wordCount = 0;

  while (queue.length) {
    const [trie, ancestor, i, j, visited] = queue.shift();

    // I need a way to calculate the ancestor.points here
    if (trie.word) {
      ancestor.word = trie.word;
      ancestor.definition = definitions[trie.word];
      ancestor.timeBonus = trie.word.length;
      ancestor.points = points[trie.word.length];
      ancestor.clueDiv = buildClueDiv(
        trie.word,
        visited,
        gameBoard,
        ancestor.definition
      );
      ancestor.path = visited;
      wordCount += 1;
    }

    let hasChildren = false;

    for (const [deltaI, deltaJ] of coords) {
      const [nextI, nextJ] = [i + deltaI, j + deltaJ];

      if (isInbounds(nextI, nextJ)) {
        ancestor.neighbors[`${nextI},${nextJ}`] = gameBoard[nextI][nextJ];
      }

      if (isValid(nextI, nextJ, visited, gameBoard, trie)) {
        const node = gameBoard[nextI][nextJ];
        const div = node.gameDiv;
        const char = node.char;
        const nextVisited = [...visited];
        const nextTrie = trie.children[char];
        const nextAncestor = new AncestoryNode(
          nextI,
          nextJ,
          char,
          div,
          ancNode
        );
        ancestor.children.set(`${nextI},${nextJ}`, nextAncestor);
        nextAncestor.parent = ancestor;

        nextVisited.push(`${nextI},${nextJ}`);
        queue.push([nextTrie, nextAncestor, nextI, nextJ, nextVisited]);

        hasChildren = true;
      }
    }

    if (!hasChildren && ancestor.word === null) {
      deadLeafNodes.push(ancestor);
    }
  }

  return [wordCount, deadLeafNodes];
};

const dropDeadBranches = (leafNodes) => {
  for (const node of leafNodes) {
    let current = node;
    let prev = null;

    while (
      current.word === null &&
      current.children.size <= 1 &&
      current.parent
    ) {
      prev = current;
      current = current.parent;
    }

    if (prev) current.children.delete(`${prev.i},${prev.j}`);
  }
};

export const buildAncestoryNode = (gameBoard, root, definitions) => {
  const deadNodes = [];

  for (let i = 0; i < 4; i += 1) {
    for (let j = 0; j < 4; j += 1) {
      const ancNode = gameBoard[i][j];
      const char = ancNode.char;
      const tile = ancNode.gameDiv;
      const trieNode = root.children[char];
      const [wordCount, deadLeafNodes] = bfs(
        gameBoard,
        ancNode,
        trieNode,
        i,
        j,
        definitions
      );

      ancNode.wordCount = wordCount;
      dropDeadBranches(deadLeafNodes);

      if (ancNode.children.size === 0 && ancNode.word === null) {
        tile.classList.add("dead-game-tile");
        ancNode.deadNode = true;

        deadNodes.push(ancNode);
      }
    }
  }

  for (const node of deadNodes) {
    for (const div of node.clueCharContainers) {
      div.style.backgroundColor = "gray";
    }
  }
};
