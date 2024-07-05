import definitions from '../src/definitions.json' with { type: "json" };
const words = Object.keys(definitions);

// just build the project in one js file and then focus on how you want to organize it
// I should calculate the best possible game board before populating the actual board
// This way once I have a board with 70 words or more I can just populate the board
class GridNode {
  constructor(i, j) {
    this.i = i;
    this.j = j;
    this.children = [];
    this.char = "AABCDEEFGHIIJKLMNOOPQRSSTUUVWXYZ"[Math.floor(Math.random() * 32)];
  }
}

// Now I want to build a 4 x 4 matrix with these gridNodes

const matrix = [
  [ new GridNode(0, 0), new GridNode(0, 1), new GridNode(0, 2), new GridNode(0, 3) ],
  [ new GridNode(1, 0), new GridNode(1, 1), new GridNode(1, 2), new GridNode(1, 3) ],
  [ new GridNode(2, 0), new GridNode(2, 1), new GridNode(2, 2), new GridNode(2, 3) ],
  [ new GridNode(3, 0), new GridNode(3, 1), new GridNode(3, 2), new GridNode(3, 3) ],
]

// Now I need to traverse through this matrix to find all of the possible words that can be made with it
// I need to first build a Trie with all of the words in the definitions object

class TrieNode {
  constructor(char) {
    this.char = char;
    this.children = {};
    this.word = null;
  }
}

const root = new TrieNode(null);