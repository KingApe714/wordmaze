import definitions from '../src/definitions.json' with { type: "json" };
const words = Object.keys(definitions);

class TrieNode {
  constructor(char) {
    this.char = char;
    this.children = {};
    this.word = null;
  }
}

const buildTrie = () => {
  const root = new TrieNode(null);
  
  for (const word of words) {
    let current = root;
  
    for (const char of word) {
      if (!(char in current.children)) {
        current.children[char] = new TrieNode(char);
      }
      current = current.children[char];
    }

    current.word = word;
  }

  return root;
}

const generateChar = () => "AABCDEEFGHIIJKLMNOOPQRSSTUUVWXYZ"[Math.floor(Math.random() * 32)];

const generateMatrix = () => {
  return [
    [ generateChar(), generateChar(), generateChar(), generateChar() ],
    [ generateChar(), generateChar(), generateChar(), generateChar() ],
    [ generateChar(), generateChar(), generateChar(), generateChar() ],
    [ generateChar(), generateChar(), generateChar(), generateChar() ],
  ]
}

const isValid = (i, j, visited, board, trie) => {
  return (
    i >= 0 && i < 4 &&
    j >= 0 && j < 4 &&
    !visited.has(`${i},${j}`) &&
    board[i][j] in trie.children
  )
}

const coords = [
  [ -1, -1 ],
  [ -1, 0 ],
  [ -1, 1 ],
  [ 0, 1 ],
  [ 1, 1 ],
  [ 1, 0 ],
  [ 1, -1 ],
  [ 0, -1 ]
]

const bfs = (matrix, root, idx, jdx) => {
  const queue = [ [ root, idx, jdx, new Set([ `${idx},${jdx}` ]) ] ];
  const foundWords = []

  while (queue.length) {
    const [ trie, i, j, visited ] = queue.shift();
    
    if (trie.word) {
      foundWords.push(trie.word);
    }

    for (const [ deltaI, deltaJ ] of coords) {
      const [ nextI, nextJ ] = [ i + deltaI, j + deltaJ ];

      if (isValid(nextI, nextJ, visited, matrix, trie)) {
        const char = matrix[nextI][nextJ];
        const nextVisited = new Set(visited);
        const nextTrie = trie.children[char];

        nextVisited.add(`${nextI},${nextJ}`);
        queue.push([ nextTrie, nextI, nextJ, nextVisited ]);
      }
    }
  }

  return foundWords;
}

// I need this function to bfs the board to find all possible words
// It'll keep being called until I have a board that has the number of words that I want
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
}

// I need to build the ancestory nodes from here to send to the main script to build a board out of
// I need to keep calling the generateMatrix function until it gives me a board with 90 words or more
const buildBoard = () => {
  const root = buildTrie();
  let current = generateMatrix();

  while (boardCheck(current, root).length < 100) {
    current = generateMatrix();
  }

}

buildBoard();