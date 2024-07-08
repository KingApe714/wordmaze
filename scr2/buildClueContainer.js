import { AncestoryNode } from "./ancestor.js";

const buildClueDiv = (word, visited, board) => {
  const innerClueContainer = document.querySelector(".inner-clue-container");
  const wordContainer = document.createElement("div");
  wordContainer.className = "clue-word-container";

  console.log(word);
  console.log(visited);

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

  // add event listener to the word container to populate a div in the control panel with the definition of the word
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

// visited has the path with all the root ancestory nodes that I need to reference
const bfs = (gameBoard, ancNode, trieNode, idx, jdx) => {
  const queue = [[trieNode, ancNode, idx, jdx, [`${idx},${jdx}`]]];
  const deadLeafNodes = [];
  let wordCount = 0;

  while (queue.length) {
    const [trie, ancestor, i, j, visited] = queue.shift();

    if (trie.word) {
      ancestor.word = trie.word;
      ancestor.clueDiv = buildClueDiv(trie.word, visited, gameBoard);
      ancestor.path = visited;
      wordCount += 1;
    }

    let hasChildren = false;

    for (const [deltaI, deltaJ] of coords) {
      const [nextI, nextJ] = [i + deltaI, j + deltaJ];

      if (isValid(nextI, nextJ, visited, gameBoard, trie)) {
        const node = gameBoard[nextI][nextJ];
        const div = node.gameDiv;
        const char = node.char;
        const nextVisited = [...visited];
        const nextTrie = trie.children[char];

        const nextAncestor = new AncestoryNode(nextI, nextJ, char, div);
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

export const buildAncestoryNode = (gameBoard, root) => {
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
        j
      );

      dropDeadBranches(deadLeafNodes);

      if (ancNode.children.size === 0 && ancNode.word === null) {
        tile.style.backgroundColor = "gray";
        ancNode.deadNode = true;
      }
    }
  }
};
