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

**Playable Game Boards**

Since the tiles have randomly generated letters on them they can sometimes make for uninteresting games. So after generating a board with
randomly generated tiles, the ancestory node algorithm is run to test for the amount of words that can be made. A board is only rendered
to the user if it has 70 unique words that can be found on it.

**Game Board**

Distinctive tile highlighting is used to singal to the user if either they've found a new word (green, enalrged), they've already found
that word (yellow, enlarged), or the current set of letters does not make a word (red, shrunken). No matter the status of the tile, they also 
shake signifying that the user is selecting it.

![game board photo snippet](https://user-images.githubusercontent.com/74022542/142067827-997dc5a6-9066-4e08-af7e-1653b812bfc8.png)

**Clue Container**

All possible words that can be found on the board are suggested in a clue container that sits to the
right of the game board. Any tile that is grayed out is automatically revealed in where it appears in
other words in the clue container; the same happens when a tile is completed and highlighted green.
Clicking on the clue word will also give the user the definition of the word.

![wordmaze video snippet](https://user-images.githubusercontent.com/74022542/142071891-ad0bd5d4-21f0-4953-a9f6-2196c8144056.png)

**End Stage Modal**

At the end of every stage a list of all possible words and where to find them is given along with the definition of each word
by hovering over the displayed path. The container holding the divs for each letter is either highlighted green signifying that
all possible words with that letter has been found, orange meaning some or all words were not found, and gray if no words could
possibly be made with that letter

![endgame modal snippet](https://user-images.githubusercontent.com/74022542/142066414-a024c913-496f-4b85-82e2-2970a32df0ae.png)


