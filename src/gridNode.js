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

    //set up gridNodes on gameBoard
    for (let i = 0; i < 4; i++) {
        let row = []
        for (let j = 0; j < 4; j++) {
            let gNode = new gridNode(`${i},${j}`)
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
    console.log(grid)

    for (let x = 0; x < grid.length; x++) {
        let row = [];
        for (let y = 0; y < grid[0].length; y++) {
            console.log(`checking for ${grid[x][y].ch} at ${grid[x][y].coordinates}`)
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

    console.log(newGrid)

    console.log(gameWords)
    
    return setUpTiles(newGrid)
}

export function setUpTiles(grid) {
    //this is grid is a grid full of ancestory nodes
    const gameBoardContainer = document.querySelector('.game-board-container')
    let mouseDown = false;
    let word = ""
    let selectedNodes = [];
    let nodeAdam = null;
    
    gameBoardContainer.addEventListener("mousedown", () => {
        mouseDown = true;
        console.log("mouse is down")
        return false;
    })
    
    gameBoardContainer.addEventListener("mouseup", () => {
        
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
    })
    for (let i = 0; i < 4; i++) {
        // let row = []
        for (let j = 0; j < 4; j++) {
            let gNode = grid[i][j].node

            //when I mousedown then I'm using this as my first tile
            gNode.innerTile.addEventListener("mousedown", () => {
                mouseDown = true;
                if (!gNode.selected) {
                    word = gNode.ch
                    selectedNodes.push(gNode)
                    gNode.tile.style.backgroundColor = "blue";

                    nodeAdam = grid[i][j]
                }
                gNode.selected = true;
            })

            //when I mousemove I am building potential words
            gNode.innerTile.addEventListener("mousemove", () => {
                let unbrokenWord = true;
                if (mouseDown) {
                    if (!gNode.selected) {
                        word += gNode.ch
                        selectedNodes.push(gNode)
                        gNode.tile.style.backgroundColor = "blue";

                        if (unbrokenWord && nodeAdam.children[gNode.coordinates]) {
                            nodeAdam = nodeAdam.children[gNode.coordinates]
                        } else {
                            unbrokenWord = false;
                        }

                        console.log(nodeAdam)

                        if (unbrokenWord && nodeAdam.complete) {
                            selectedNodes.forEach(node => {
                                node.tile.style.backgroundColor = "yellow"
                            })
                        } else {
                            selectedNodes.forEach(node => {
                                node.tile.style.backgroundColor = "blue"
                            })
                        }
                    } else {
                        //so I know that gNode is selected here
                        //I need to know if you've left and come back..
                        let lastNode = selectedNodes[selectedNodes.length - 1];
                        if (lastNode !== gNode) {
                            lastNode.tile.style.backgroundColor = "white";
                            selectedNodes.pop()
                            word = word.slice(0, -1)
                            if (unbrokenWord) {
                                nodeAdam = nodeAdam.parent
                                console.log(nodeAdam)
                                if (nodeAdam.complete) {
                                    selectedNodes.forEach(node => {
                                        node.tile.style.backgroundColor = "yellow"
                                    })
                                }
                            }
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
            // row.push(gNode)
        }
        // grid.push(row)
    }
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
                        // console.log(currentNode)
                        // debugger
                        if (currentNode.children[ele[2][x].coordinates]) {
                            currentNode = currentNode.children[ele[2][x].coordinates]
                        }
                    }

                    // debugger
                    currentNode.children[ele[1].node.neighbors[i].coordinates] = new ancestoryNode(ele[1].node.neighbors[i])
                    let newAncNode = currentNode.children[ele[1].node.neighbors[i].coordinates]
                    newAncNode.complete = subTree.complete
                    newAncNode.parent = ele[1]

                    // console.log(currentNode.children[ele[1].neighbors[i].coordinates])

                    queue.push([subTree, newAncNode, path])
                }
            }
        }
    }
    console.log(words)
    console.log(rootAncNode)
    return [words, rootAncNode]
}