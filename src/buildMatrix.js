import { Ancestor } from "./ancestor.js";

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

const generateRandomCombinations = (rows, cols) => {
  const combos = [];

  // Generate all possible combos of (i, j)
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      combos.push([i, j]);
    }
  }

  // Shuffle the combos array to get random combos
  for (let k = combos.length - 1; k > 0; k--) {
    const randomIndex = Math.floor(Math.random() * (k + 1));
    [combos[k], combos[randomIndex]] = [combos[randomIndex], combos[k]];
  }

  const res = [];
  let inner = [];

  for (let i = 0; i < combos.length; i += 1) {
    inner.push(combos[i]);

    if (i !== 0 && i % 4 === 3) {
      res.push(inner);
      inner = [];
    }
  }

  return res;
};

const findBoard = (root) => {
  let charMatrix = generateMatrix();
  let foundWords = boardCheck(charMatrix, root);

  while (foundWords.length < 85) {
    charMatrix = generateMatrix();
    foundWords = boardCheck(charMatrix, root);
  }

  return [charMatrix, foundWords];
};

const findDictionary = (foundWords, definitions) => {
  const dictionary = new Map();

  for (const word of foundWords) {
    dictionary.set(word, definitions[word]);
  }

  return dictionary;
};

const buildGameTile = (combo, char) => {
  const gameTile = document.createElement("div");
  const [idx, jdx] = combo;
  gameTile.className = `game-tile piece-${idx}-${jdx}`;
  gameTile.innerHTML = char;

  const innerTile = document.createElement("div");
  innerTile.className = `inner-game-tile`;
  gameTile.appendChild(innerTile);

  return [gameTile, innerTile];
};

const visitIDs = [
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
  73, 79, 83, 89, 97,
];

export const buildRootMatrix = (root, definitions) => {
  const [charMatrix, foundWords] = findBoard(root);
  const dictionary = findDictionary(foundWords, definitions);
  const combos = generateRandomCombinations(4, 4);
  const innerGameContainer = document.querySelector(".inner-game-container");
  const ancestoryMatrix = [];

  for (let i = 0; i < 4; i += 1) {
    const innerRow = document.createElement("div");
    innerRow.className = "game-row";
    const inner = [];

    for (let j = 0; j < 4; j += 1) {
      const char = charMatrix[i][j];
      const [gameTile, innerTile] = buildGameTile(combos[i][j], char);
      innerRow.appendChild(gameTile);

      const idx = i * 4 + j;
      const visitID = BigInt(visitIDs[idx]);
      const piece = `piece-${i}-${j}`;
      const node = new Ancestor(
        i,
        j,
        char,
        gameTile,
        innerTile,
        visitID,
        piece
      );
      inner.push(node);
    }

    ancestoryMatrix.push(inner);
    innerGameContainer.appendChild(innerRow);
  }

  return { ancestoryMatrix, dictionary };
};
