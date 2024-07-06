class AncestoryNode {
  constructor(i, j, div) {
    this.i = i;
    this.j = j;
    this.gameDiv = div;
    this.children = {};
    this.word = null;
    this.clueDiv = null;
    this.found = false;
  }
}

const buildClueDiv = (word) => {
  const innerClueContainer = document.querySelector(".inner-clue-container");
  const wordContainer = document.createElement("div");
  wordContainer.className = "clue-word-container";

  for (const char of word) {
    const charContainer = document.createElement("div");
    charContainer.className = "clue-char-container";
    charContainer.innerHTML = char;
    wordContainer.appendChild(charContainer);
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
    board[i][j].innerHTML in trie.children
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

const bfs = (matrix, ancNode, trieNode, idx, jdx) => {
  const queue = [[trieNode, ancNode, idx, jdx, [`${idx},${jdx}`]]];

  while (queue.length) {
    const [trie, ancestor, i, j, visited] = queue.shift();

    if (trie.word) {
      ancestor.word = trie.word;
      ancestor.clueDiv = buildClueDiv(trie.word);
    }

    for (const [deltaI, deltaJ] of coords) {
      const [nextI, nextJ] = [i + deltaI, j + deltaJ];

      if (isValid(nextI, nextJ, visited, matrix, trie)) {
        const div = matrix[nextI][nextJ];
        const char = div.innerHTML;
        const nextVisited = [...visited];
        const nextTrie = trie.children[char];

        const nextAncestor = new AncestoryNode(nextI, nextJ, div);
        ancestor.children[`${nextI},${nextJ}`] = nextAncestor;

        nextVisited.push(`${nextI},${nextJ}`);
        queue.push([nextTrie, nextAncestor, nextI, nextJ, nextVisited]);
      }
    }
  }
};

export const buildAncestoryNode = (gameBoard, root) => {
  const ancestoryMatrix = [];

  for (let i = 0; i < 4; i += 1) {
    const inner = [];

    for (let j = 0; j < 4; j += 1) {
      const tile = gameBoard[i][j];
      const char = tile.innerHTML;
      const ancNode = new AncestoryNode(i, j, tile);
      const trieNode = root.children[char];

      bfs(gameBoard, ancNode, trieNode, i, j);
      inner.push(ancNode);
    }

    ancestoryMatrix.push(inner);
  }

  return ancestoryMatrix;
};
