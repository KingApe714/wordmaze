import { fetchWord } from "./trie";

//lets try unnesting the ancestoryNode from inside of this node
export function gridNode(coordinates) {
    this.neighbors = [];
    this.coordinates = coordinates;
    // this.ancestory = new ancestoryNode(this);

    this.tile = document.createElement('div')
    this.tile.className = "game-tile";
    let letter = "AABCDEEFGHIIJKLMNOOPQRSSTUUVWXYZ"[Math.floor(Math.random() * 32)]
    this.ch = letter;

    this.innerTile = document.createElement('div')
    this.innerTile.className = "inner-game-tile"
    this.innerTile.innerHTML = `${letter} [${coordinates}]`;
    this.tile.appendChild(this.innerTile)

    this.selected = false;
}

export function ancestoryNode(node) {
    this.node = node;
    this.complete = false;
    this.children = {};
    this.parent = null;
}

export function setUpGrid(root) {
    const grid = []
    //set up neighbor check
    const nCheck = [
        [-1, 1],
        [0, 1],
        [1, 1],
        [1, 0],
        [1, -1],
        [0, -1],
        [-1, -1],
        [-1, 0]
    ]

    //set up gridNodes for gameBoard
    for (let i = 0; i < 4; i++) {
        let row = []
        for (let j = 0; j < 4; j++) {
            let gNode = new gridNode(`${j},${i}`)
            gNode.tile.style.left = j * 100 + "px";
            gNode.tile.style.top = i * 100 + "px";
            row.push(gNode)
        }
        grid.push(row)
    }

    //set up gridNode neighbors
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {

            //set up neighbors
            nCheck.forEach(n => {
                let x = n[0] + i;
                let y = n[1] + j;
                //handle edge cases
                if (x >= 0 && x < grid.length && y >= 0 && y < grid[0].length) {
                    grid[i][j].neighbors.push(grid[x][y])
                }
            })
        }
    }

    const gameWords = []

    const newGrid = []

    for (let x = 0; x < grid.length; x++) {
        let row = [];
        for (let y = 0; y < grid[0].length; y++) {
            let arr = findWords(grid[x][y], root.map[grid[x][y].ch])
            row.push(arr[1])
            arr[0].forEach(word => {
                if (!gameWords.includes(word)) {
                    gameWords.push(word)
                }
            })
        }
        newGrid.push(row)
    }
    console.log(gameWords)
    
    return setUpTiles(newGrid, gameWords)
}

export function setUpTiles(grid, gameWords) {
    //this grid is a grid full of ancestory nodes
    const gameBoardContainer = document.querySelector('.game-board-container')
    const svgContainer = document.querySelector('.svg-container')
    let mouseDown = false;
    let word = ""
    let selectedNodes = [];
    let nodeAdam = null;

    let foundWords = []
    
    gameBoardContainer.addEventListener("mousedown", () => {
        mouseDown = true;
        return false;
    })
    
    gameBoardContainer.addEventListener("mouseup", () => {

        if (gameWords.includes(word) && !foundWords.includes(word)) {
            foundWords.push(word)
        }
        
        word = "";
        selectedNodes = [];
        nodeAdam = null;
    
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[0].length; j++) {
                let gNode = grid[i][j].node;
                gNode.tile.style.backgroundColor = "white";
                gNode.selected = false
            }
        }

        while (svgContainer.firstChild) {
            svgContainer.removeChild(svgContainer.firstChild)
        }

        console.log(gameBoardContainer)
    })
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let gNode = grid[i][j].node

            //when I mousedown then I'm using this as my first tile
            gNode.innerTile.addEventListener("mousedown", () => {
                mouseDown = true;
                if (!gNode.selected) {
                    word += gNode.ch
                    selectedNodes.push(gNode)
                    gNode.tile.style.backgroundColor = "blue";

                    nodeAdam = grid[i][j]
                }
                gNode.selected = true;
            })

            //when I mousemove I am building potential words
            gNode.innerTile.addEventListener("mousemove", () => {
                let lastNode
                if (mouseDown) {
                    //I know that I'm mousing over the node...
                    if (!gNode.selected) {
                        let newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                        let [x1, y1] = selectedNodes[selectedNodes.length -1].coordinates.split(',')
                        let [x2, y2] = gNode.coordinates.split(',')
                        console.log(`x1 = ${x1 * 100} y1 = ${y1 * 100} x2 = ${x2 * 100} y2 = ${y2 * 100}`)
                        newLine.setAttribute('class', 'game-line')
                        newLine.setAttribute('x1', `${x1 * 100 + 50}`)
                        newLine.setAttribute('y1', `${y1 * 100 + 50}`)
                        newLine.setAttribute('x2', `${x2 * 100 + 50}`)
                        newLine.setAttribute('y2', `${y2 * 100 + 50}`)
                        svgContainer.appendChild(newLine)
                        console.log(svgContainer)

                        word += gNode.ch;
                        selectedNodes.push(gNode)
                        gNode.tile.style.backgroundColor = "blue"
                        
                        if (nodeAdam && nodeAdam.children[gNode.coordinates]
                            && nodeAdam.node === selectedNodes[selectedNodes.length - 2]) {
                            nodeAdam = nodeAdam.children[gNode.coordinates]
                        }
                        
                        lastNode = selectedNodes[selectedNodes.length - 1];
                    } else {
                        if (selectedNodes.includes(gNode)) {
                            let currentNode
                            for (let i = selectedNodes.length - 1; i >= 0; i--) {
                                currentNode = selectedNodes[i];
                                if (currentNode === gNode) {
                                    break
                                } else {
                                    currentNode.tile.style.backgroundColor = "white";
                                    currentNode.selected = false
                                    word = word.slice(0, word.length - 1)
                                    selectedNodes.pop();
                                }
                            }
                            if (nodeAdam.parent && currentNode === nodeAdam.parent.node) {
                                nodeAdam = nodeAdam.parent
                            }
                            lastNode = selectedNodes[selectedNodes.length - 1];
                        }
                    }
                    //there will always be one more selectedNode than there is lines
                    //therefore I just need to delete all the lines past selectedNodes.length - 2
                    let x = selectedNodes.length - 1
                    let dif = svgContainer.children.length - x
                    for (let i = 0; i < dif; i++) {
                        // console.log(svgContainer.children[i])
                        // debugger
                        if (svgContainer.lastChild) svgContainer.removeChild(svgContainer.lastChild)
                    }
                    for (let i = 0; i < selectedNodes.length; i++) {
                        let node1 = selectedNodes[i]
                        //now check to see if I have a complete word or not
                        if (lastNode === nodeAdam.node && nodeAdam.complete) {
                            node1.tile.style.backgroundColor = "yellow"
                        } else {
                            node1.tile.style.backgroundColor = "blue"
                        }
                    }
                    gNode.selected = true
                    console.log(word)
                }
            })
            
            gNode.innerTile.addEventListener("mouseup", () => {
                mouseDown = false;
                gNode.selected = false;
            })
            gameBoardContainer.appendChild(gNode.tile)
        }
    }
    console.log(svgContainer)

    return foundWords
}

export function findWords(gridNode, tree) {
    //gridNode could be my Adam
    const words = [];
    //pos 2 of all queued is the path from original gridNode to currentNode
    //use pos 2 to key into ancestory to set up next nodes
    let rootAncNode = new ancestoryNode(gridNode);
    const queue = [[tree, rootAncNode, [gridNode]]];

    while (queue.length) {
        let ele = queue.shift();
        if (ele[0].complete) {
            let currentWord = fetchWord(ele[0])
            if (!words.includes(currentWord)) {
                words.push(currentWord)
            }
        }
        let visitedNodes = ele[2].slice()
        for (let i = 0; i < ele[1].node.neighbors.length; i++) {
            if (!visitedNodes.includes(ele[1].node.neighbors[i]) &&
                !ele[2].includes(ele[1].node.neighbors[i])) {

                let path = ele[2].slice()
                path.push(ele[1].node.neighbors[i])
                visitedNodes.push(ele[1].node.neighbors[i])

                let char = ele[1].node.neighbors[i].ch
                let subTree = ele[0]
                if (subTree.map[char]) {
                    subTree = subTree.map[char];
                    
                    let currentNode = rootAncNode
                    //key into ancestory until at the right position
                    for (let x = 0; x < ele[2].length; x++) {
                        if (currentNode.children[ele[2][x].coordinates]) {
                            currentNode = currentNode.children[ele[2][x].coordinates]
                        }
                    }

                    currentNode.children[ele[1].node.neighbors[i].coordinates] = new ancestoryNode(ele[1].node.neighbors[i])
                    let newAncNode = currentNode.children[ele[1].node.neighbors[i].coordinates]
                    newAncNode.complete = subTree.complete
                    newAncNode.parent = ele[1]

                    queue.push([subTree, newAncNode, path])
                }
            }
        }
    }
    return [words, rootAncNode]
}