import { trieNode, add } from './trie.js';
import { gridNode } from './gridNode.js'

let globalDictionary = null;

async function getDictionay() {
    const response = await fetch('dictionary.txt');
    const data = await response.text();
    globalDictionary = data.split(/\r?\n/).filter(word => {
        return word.length > 2
    })
}

async function game() {
    await getDictionay()
    const root = new trieNode(null);
    for (const item of globalDictionary)
        add(item, 0, root)
    
    let grid = setUpGrid()

    //next lets find all possible words with the letters that are given using the trieTree
    const gameWords = [];
    for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid[0].length; y++) {
            findWords(grid[x][y], root)
        }
    }
}
    

function findWords(cell, root) {
    const words = [];
    const queue = [[root, cell]];
    const visitedCells = [cell];

    //for ele, tree is position 0 and cell is position 1
    //for cell tile is position 0 and node is position 1
    while (queue.length) {
        let ele = queue.shift();
        for (let i = 0; i < ele[1][1].neighbors.length; i++) {
            if (ele[0].complete) {
                let currentWord = fetchWord(ele[0])
                if (!words.includes(currentWord)) {
                    words.push(currentWord)
                }
            }
            if (!visitedCells.includes(ele[1][1].neighbors[i])) {
                visitedCells.push(ele[1][1])
                //grab the char of the current neighbor
                console.log(`${ele[1][1].coordinates} ${ele[1][1].ch}`)
                console.log(ele[1][1].neighbors[i][1].ch)
                let char = ele[1][1].neighbors[i][1].ch
                let subTree = ele[0]
                if (subTree.map[char]) {
                    subTree = subTree.map[char];
                    //I just need to give it the next cell
                    queue.push([subTree, ele[1][1].neighbors[i]])
                }
            }
        }
    }
    // console.log(cell[1].coordinates)
    // console.log(words)
}

function fetchWord(currentNode) {
    let nodeCheck = currentNode;
    let word = '';
    while(nodeCheck.parent !== null) {
        word = nodeCheck.ch + word;
        nodeCheck = nodeCheck.parent;
    }
    
    return word;
}

//set up gridNodes with their respective divs in an inner array length 2
function setUpGrid() {
    const grid = []
    const gameBoardContainer = document.querySelector('.game-board-container')
    //set up neighbor check
    const nCheck = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [1, -1],
        [1, 0],
        [1, 1],
        [0, 1],
        [0, -1]
    ]

    for (let i = 0; i < 4; i++) {
        let row = []
        for (let j = 0; j < 4; j++) {
            let cell = []
            let tile = document.createElement('div')
            let letter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)]

            tile.className = "game-tile"
            tile.style.left = j * 100 + "px";
            tile.style.top = i * 100 + "px";
            tile.innerHTML = `${letter} [${i},${j}]`
            gameBoardContainer.appendChild(tile)

            cell.push(tile)
            cell.push(new gridNode(letter, `${i},${j}`))
            row.push(cell)
        }
        grid.push(row)
    }

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {

            //set up neighbors
            nCheck.forEach(n => {
                let x = n[0] + i;
                let y = n[1] + j;
                //handle edge cases
                if (x >= 0 && x < grid.length && y >= 0 && y < grid[0].length) {
                    grid[i][j][1].neighbors.push(grid[x][y])
                }
            })
        }
    }
    return grid
}

export default game