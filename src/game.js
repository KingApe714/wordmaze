import { trieNode, add } from './trie.js';
import { gridNode } from './gridNode.js'

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

// const alphabet = "abcdefghijklmnopqrstuvwxyz"

// const randomCharacter = alphabet[Math.floor(Math.random() * alphabet.length)]


//set up gridNodes with their respective divs in an inner array length 2
function setUpGrid() {
    const grid = []
    const gameBoardContainer = document.querySelector('.game-board-container')
    for (let i = 0; i < 4; i++) {
        let row = []
        for (let j = 0; j < 4; j++) {
            let cell = []
            let tile = document.createElement('div')
            let letter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)]

            tile.className = "game-tile"
            tile.style.left = j * 100 + "px";
            tile.style.top = i * 100 + "px";
            tile.innerHTML = letter
            gameBoardContainer.appendChild(tile)

            cell.push(tile)
            cell.push(new gridNode(letter, `${i},${j}`))
            row.push(cell)
        }
        grid.push(row)
    }

    console.log(grid)
}

export default game