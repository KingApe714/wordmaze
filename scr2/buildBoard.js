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

    if (trie.word && trie.word.length >= 3) {
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

const findBoard = (root) => {
  let currentMatrix = generateMatrix();
  let foundWords = boardCheck(currentMatrix, root);

  while (foundWords.length < 70) {
    currentMatrix = generateMatrix();
    foundWords = boardCheck(currentMatrix, root);
  }

  return { currentMatrix, foundWords };
};

export const buildBoard = (root) => {
  const { currentMatrix, foundWords } = findBoard(root);
  const innerGameContainer = document.querySelector(".inner-game-container");
  const gameBoard = [];

  for (let i = 0; i < 4; i += 1) {
    const row = document.createElement("div");
    row.className = "game-row";
    const inner = [];

    for (let j = 0; j < 4; j += 1) {
      const char = currentMatrix[i][j];
      const tile = document.createElement("div");
      tile.className = "game-tile";
      tile.innerHTML = char;

      const innerTile = document.createElement("div");
      innerTile.className = "inner-game-tile";
      tile.appendChild(innerTile);

      const node = new AncestoryNodeRoot(
        i,
        j,
        char,
        tile,
        innerTile,
        gameBoard
      );

      inner.push(node);
      row.appendChild(tile);
    }

    innerGameContainer.appendChild(row);
    gameBoard.push(inner);
  }

  return gameBoard;
};
