# wordmaze
A game inspired by the popular IPhone game pigeon app, 'Word Press'. Like Word Press the game automatically generates a random plot 
of letters on a 4 x 4 grid and generates a game that has at least 70 unique words to find. Time bonuses are given (depending on the length)
for every word that is found. Grayed out tiles means that no word can be made that starts with that particular tile. Green highlighted tiles
means that user has found all possible words that can made with that tile.

# Technologies

* Vanilla Javascript
* HTML/CSS

# Development

**Ancestory Nodes**

Two graphs were needed in order to build a game board and find all possible words. The first is a Trie Tree which is a tree that holds a dictionary
of over 200,000 words. The second is the 4 x 4 grid itself that establishes the neighbours of each cell. Merging these two trees birthed the 
Ancestory tree, where beginning at each tile there is a parent child relationship established amongst neighbors determined by checking if that
neighboring tile forms a path to complete a word

```javascript
export function trieNode(ch) {
    this.ch = ch;
    this.complete = false;
    this.map = {};
    this.parent = null;
    this.words = [];
}

export function add(str, i, root) {
    if (i === str.length) {
        root.complete = true;
        return
    }

    if (!root.map[str[i]]) {
        root.map[str[i]] = new trieNode(str[i])
        root.map[str[i]].parent = root;
    }

    root.words.push(str);
    add(str, i + 1, root.map[str[i]]);
}

export function gridNode(coordinates) {
    this.neighbors = [];
    this.coordinates = coordinates;
    this.tile = document.createElement('div')
    this.tile.className = "game-tile";
    this.tile.onselectstart = () => {
        return false;
    }
    let letter = "AABCDEEFGHIIJKLMNOOPQRSSTUUVWXYZ"[Math.floor(Math.random() * 32)]
    this.ch = letter;

    this.innerTile = document.createElement('div')
    this.innerTile.className = "inner-game-tile"
    this.innerTile.innerHTML = `${letter}`;

    this.innerTileContainer = document.createElement('div')
    this.innerTileContainer.className = "inner-tile-container"
    this.innerTileContainer.appendChild(this.innerTile)

    this.tile.appendChild(this.innerTileContainer)

    this.selected = false;
}

export function ancestoryNode(node) {
    this.node = node;
    this.complete = false;
    this.children = {};
    this.parent = null;

    this.timeBonus = 1;
    this.points = 100;
    this.found = false;

    //properly set up the word at the nodes that return a .complete
    //then at the node store the definition
    //later create an object with that references each node, all the words and their definitions
    this.words = []
    this.definitions = {}

    //everywhere this node appears in a clue word will be referenced here
    this.clueDivs = []

    this.clueWordContainer = null;
}
```

**Clue Container**

All possible words that can be found on the board are suggested in a clue container that sits to the
right of the game board. Any tile that is grayed out is automatically revealed in where it appears in
other words in the clue container; the same happens when a tile is completed and highlighted green.
Clicking in the clue word will also give the user the definition of the word

![wordmaze photo snippet]
