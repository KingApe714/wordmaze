class TrieNode {
  constructor(char) {
    this.char = char;
    this.children = {};
    this.word = null;
  }
}

export const buildTrie = (definitions) => {
  const words = Object.keys(definitions);
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

  console.log(root);
  return root;
};
