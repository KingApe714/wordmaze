import { buildRootMatrix } from "./buildMatrix.js";

const buildClueDiv = (word, visited, ancMatrix, definition, paths) => {
  const innerClueContainer = document.querySelector(".inner-clue-container");
  const definitionsContainer = document.querySelector(".definitions-container");
  const wordContainer = document.createElement("div");

  wordContainer.className = "clue-word-container";
  wordContainer.addEventListener("mousedown", (e) => {
    e.preventDefault();
    definitionsContainer.innerHTML = definition || null;
  });

  for (let i = 0; i < word.length; i += 1) {
    // create reference between char-clue-div and root ancestory node
    const [idx, jdx] = visited[i].split(",");
    const rootAncestor = ancMatrix[idx][jdx];
    const charContainer = document.createElement("div");
    charContainer.className = "clue-char-container";

    wordContainer.appendChild(charContainer);
    rootAncestor.clueCharDivs.push(charContainer);
  }

  paths.set(visited.join("-"), { found: false, wordContainer, word });
  innerClueContainer.appendChild(wordContainer);
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

const bfs = (i, j, trieNode, ancMatrix, dictionary, paths) => {
  const queue = [[i, j, trieNode, [`${i},${j}`]]];

  while (queue.length) {
    const [idx, jdx, trie, visited] = queue.shift();

    if (trie.word) {
      const word = trie.word;
      const definition = dictionary.get(word);
      buildClueDiv(word, visited, ancMatrix, definition, paths);
      ancMatrix[i][j].wordCount += 1;
    }

    for (const [deltaI, deltaJ] of coords) {
      const [nextI, nextJ] = [idx + deltaI, jdx + deltaJ];

      if (isValid(nextI, nextJ, visited, ancMatrix, trie)) {
        const nextVisited = [...visited, `${nextI},${nextJ}`];
        const char = ancMatrix[nextI][nextJ].char;
        const nextTrie = trie.children[char];

        queue.push([nextI, nextJ, nextTrie, nextVisited]);
      }
    }
  }
};

const setUpNeighbors = (matrix, idx, jdx) => {
  const node = matrix[idx][jdx];

  for (const [deltaI, deltaJ] of coords) {
    const [nextI, nextJ] = [idx + deltaI, jdx + deltaJ];

    if (isInbounds(nextI, nextJ)) {
      const key = `${nextI},${nextJ}`;
      const nei = matrix[nextI][nextJ];

      node.neighbors[key] = nei;
    }
  }
};

const handleDeadNodes = (deadNodes) => {
  for (const node of deadNodes) {
    node.gameTile.classList.add("dead-game-tile");
    const char = node.char;

    node.deadNode = true;
    for (const div of node.clueCharDivs) {
      div.style.backgroundImage = window.getComputedStyle(
        node.gameTile
      ).backgroundImage;
      div.innerText = char;
      div.classList.add("dead-game-tile");
    }
  }
};

export const buildBoard = (root, definitions) => {
  const { ancestoryMatrix, dictionary } = buildRootMatrix(root, definitions);
  const paths = new Map();
  const deadNodes = [];

  for (let i = 0; i < 4; i += 1) {
    const innerRow = document.createElement("div");
    innerRow.className = "game-row";

    for (let j = 0; j < 4; j += 1) {
      const node = ancestoryMatrix[i][j];
      const char = node.char;
      const trieNode = root.children[char];

      bfs(i, j, trieNode, ancestoryMatrix, dictionary, paths);
      setUpNeighbors(ancestoryMatrix, i, j);

      if (node.wordCount === 0) {
        deadNodes.push(node);
      }
    }
  }

  handleDeadNodes(deadNodes);
  return { ancestoryMatrix, paths };
};
