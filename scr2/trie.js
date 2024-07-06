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

export const root = buildTrie();