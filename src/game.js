import { trieNode, add } from './trie.js';

let globalDictionary = null;

async function game() {
    await getDictionay()
    const root = new trieNode(null);
    for (const item of globalDictionary)
        add(item, 0, root)
    
    console.log(globalDictionary)
    console.log(root)
}

async function getDictionay() {
    const response = await fetch('dictionary.txt');
    const data = await response.text();

    globalDictionary = data.split(/\r?\n/).filter(word => {
        return word.length > 2
    })
    setUpGrid()
}

//set up gridNodes with their respective divs in an inner array length 2
function setUpGrid() {
    const gameBoardContainer = document.querySelector('.game-board-container')
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let tile = document.createElement('div')
            tile.className = "game-tile"
            tile.style.left = j * 100 + "px";
            tile.style.top = i * 100 + "px";
            gameBoardContainer.appendChild(tile)
        }
    }
}

export default game