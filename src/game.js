import { trieNode, add, fetchWord } from './trie.js';
import { gridNode, setUpGrid, findWords } from './gridNode.js'
import { modal, timer } from './util.js'

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
    
    modal()
    timer()

    const body = document.body;

    let grid = setUpGrid(root)
    let miniGrid = []
    grid.forEach(row => {
        let miniRow = []
        row.forEach(ancNode => {
            let miniTile = document.createElement('div')
            miniTile.className = "mini-tile";
            miniTile.innerHTML = ancNode.node.ch

            miniRow.push(miniTile)
        })
        miniGrid.push(miniRow)
    })

    let miniBoard = document.createElement('div')
    miniBoard.className = "mini-board";
    for (let i = 0; i < miniGrid.length; i++) {
        for (let j = 0; j < miniGrid[0].length; j++) {
            miniGrid[i][j].style.left = j * 30 + "px";
            miniGrid[i][j].style.top = i * 30 + "px";
            miniBoard.append(miniGrid[i][j])
        }
    }

    body.append(miniBoard)


    console.log(grid)
    //grab each root ancestory node and return the mini paths with all words
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            let rootNode = grid[i][j]
            wordPaths(rootNode)
        }
    }
}
    
//this function should return the array of mini divs that show the paths
function wordPaths(rootNode) {
    //create the mini game board to then draw the line over it to show the path

    console.log(rootNode)
    //I need to DFS through the rootNode tree to find all words
    let stack = [rootNode];
    // while (stack.length) {

    // }
}

export default game