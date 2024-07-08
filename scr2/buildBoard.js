import { AncestoryNodeRoot } from "./ancestor.js";

const generateChar = () =>
  "AABCDEEFGHIIJKLMNOOPQRSSTUUVWXYZ"[Math.floor(Math.random() * 32)];

const generateMatrix = () => {
  return [
    [generateChar(), generateChar(), generateChar(), generateChar()],
    [generateChar(), generateChar(), generateChar(), generateChar()],
    [generateChar(), generateChar(), generateChar(), generateChar()],
    [generateChar(), generateChar(), generateChar(), generateChar()],
  ];
};

const isValid = (i, j, visited, board, trie) => {
  return (
    i >= 0 &&
    i < 4 &&
    j >= 0 &&
    j < 4 &&
    !visited.includes(`${i},${j}`) &&
    board[i][j] in trie.children
  );
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

const bfs = (matrix, root, idx, jdx) => {
  const queue = [[root, idx, jdx, [`${idx},${jdx}`]]];
  const foundWords = [];

  while (queue.length) {
    const [trie, i, j, visited] = queue.shift();

    if (trie.word) {
      foundWords.push(trie.word);
    }

    for (const [deltaI, deltaJ] of coords) {
      const [nextI, nextJ] = [i + deltaI, j + deltaJ];

      if (isValid(nextI, nextJ, visited, matrix, trie)) {
        const char = matrix[nextI][nextJ];
        const nextVisited = [...visited];
        const nextTrie = trie.children[char];

        nextVisited.push(`${nextI},${nextJ}`);
        queue.push([nextTrie, nextI, nextJ, nextVisited]);
      }
    }
  }

  return foundWords;
};

const boardCheck = (board, root) => {
  const words = [];

  for (let i = 0; i < 4; i += 1) {
    for (let j = 0; j < 4; j += 1) {
      const char = board[i][j];
      const node = root.children[char];
      const currentFound = bfs(board, node, i, j);
      words.push(...currentFound);
    }
  }

  return words;
};

export const findBoard = (root) => {
  let currentMatrix = generateMatrix();
  let foundWords = boardCheck(currentMatrix, root);

  while (foundWords.length < 100) {
    currentMatrix = generateMatrix();
    foundWords = boardCheck(currentMatrix, root);
  }

  console.log(foundWords);
  return { currentMatrix, foundWords };
};

// I want to set up the board with AncestoryNodeRoots so that I can pass it to the next file
export const buildBoard = (root) => {
  const { currentMatrix, foundWords } = findBoard(root);
  const innerGameContainer = document.querySelector(".inner-game-container");
  const gameBoard = [];

  for (const arr of currentMatrix) {
    const row = document.createElement("div");
    row.className = "game-row";
    const inner = [];

    for (const char of arr) {
      const tile = document.createElement("div");
      tile.className = "game-tile";
      tile.innerHTML = char;

      inner.push(tile);
      row.appendChild(tile);
    }

    innerGameContainer.appendChild(row);
    gameBoard.push(inner);
  }

  const gameBoardTest = [];

  for (let i = 0; i < 4; i += 1) {
    for (let j = 0; j < 4; j += 1) {}
  }

  return gameBoard;
};
