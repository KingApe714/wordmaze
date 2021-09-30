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

    let grid = setUpGrid(root)
    let miniGrid = []
    const body = document.body;
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
            miniGrid[i][j].style.left = j * 25 + "px";
            miniGrid[i][j].style.top = i * 25 + "px";
            miniBoard.append(miniGrid[i][j])
        }
    }

    const allPaths = document.createElement('div');
    //grab each root ancestory node and return the mini paths with all words
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            let rootNode = grid[i][j]
            allPaths.appendChild(wordPaths(rootNode, miniBoard))
        }
    }

    const modalChild = document.querySelector('.modal-child')
    modalChild.appendChild(allPaths)

    // body.appendChild(allPaths)
}
    
//this function should return the array of mini divs that show the paths
function wordPaths(rootNode, miniBoard) {
    //create the mini game board to then draw the line over it to show the path
    const currentPathsOuter = document.createElement('div');
    currentPathsOuter.className = 'current-paths-outer'

    const currentPathsInner = document.createElement('div');
    currentPathsInner.className = 'current-paths-inner'

    const title = document.createElement('p')
    title.className = 'path-title'
    title.innerHTML = `${rootNode.node.ch} at ${rootNode.node.coordinates} possible words`
    currentPathsOuter.appendChild(title)
    //I need to BFS through the rootNode tree to find all words
    let queue = [rootNode];
    while (queue.length) {
        let currentNode = queue.shift();

        for (const key in currentNode.children) {
            queue.push(currentNode.children[key])
        }

        //I need to create new mini svg containers to place over the mini game boards
        if (currentNode.complete) {
            let miniBoardCopy = miniBoard.cloneNode(true)
            let wordContainer = document.createElement('p')
            let boardContainer = document.createElement('div')
            let [word, svgContainer] = drawLine(currentNode)

            wordContainer.className = "word-container"
            wordContainer.innerHTML = word

            miniBoardCopy.append(svgContainer)

            boardContainer.className = "board-container"
            boardContainer.append(miniBoardCopy)
            boardContainer.append(wordContainer)

            currentPathsInner.append(boardContainer)
        }
    }

    currentPathsOuter.appendChild(currentPathsInner)
    return currentPathsOuter
}

function drawLine(currentNode) {
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    let word = currentNode.node.ch
    svg.setAttribute('width', '100');
    svg.setAttribute('height', '100');
    svg.setAttribute('style', 'border: 1px solid orange');
    while(currentNode.parent) {
        let newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        let [x1, y1] = currentNode.node.coordinates.split(',');
        let [x2, y2] = currentNode.parent.node.coordinates.split(',');
        newLine.setAttribute('class', 'mini-game-line')
        newLine.setAttribute('x1', `${x1 * 25 + 12.5}`)
        newLine.setAttribute('y1', `${y1 * 25 + 12.5}`)
        newLine.setAttribute('x2', `${x2 * 25 + 12.5}`)
        newLine.setAttribute('y2', `${y2 * 25 + 12.5}`)
        svg.appendChild(newLine)

        word = currentNode.parent.node.ch + word;
        currentNode = currentNode.parent
    }

    return [word, svg]
}

export default game