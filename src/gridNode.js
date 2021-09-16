import { fetchWord } from "./trie";

export function gridNode(coordinates) {
    this.neighbors = [];
    this.coordinates = coordinates;
    this.ancestory = {
        node: this,
        complete: false,
        children: {}
    };

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

export function setUpGrid() {
    const grid = []
    const gameBoardContainer = document.querySelector('.game-board-container')
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
                let gNode = grid[i][j];
                gNode.tile.style.backgroundColor = "white";
                gNode.selected = false
            }
        }
    })

    for (let i = 0; i < 4; i++) {
        let row = []
        for (let j = 0; j < 4; j++) {
            let gNode = new gridNode(`${i},${j}`)
            gNode.tile.style.left = j * 100 + "px";
            gNode.tile.style.top = i * 100 + "px";

            //when I mousedown then I'm using this as my first tile
            gNode.innerTile.addEventListener("mousedown", () => {
                mouseDown = true;
                if (!gNode.selected) {
                    word = gNode.ch
                    selectedNodes.push(gNode)
                    gNode.tile.style.backgroundColor = "blue";

                    nodeAdam = gNode.ancestory
                }
                gNode.selected = true;
            })

            //when I mousemove I am building potential words
            gNode.innerTile.addEventListener("mousemove", () => {
                if (mouseDown) {
                    if (!gNode.selected) {
                        word += gNode.ch
                        selectedNodes.push(gNode)
                        gNode.tile.style.backgroundColor = "blue";

                        if (nodeAdam.children[gNode.coordinates]) {
                            nodeAdam = nodeAdam.children[gNode.coordinates]
                        }

                        console.log(nodeAdam)

                        if (nodeAdam.complete) {
                            selectedNodes.forEach(node => {
                                node.tile.style.backgroundColor = "yellow"
                            })
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
            row.push(gNode)
        }
        grid.push(row)
    }

    //for testing
    // grid[0][0].ch = "C"
    // grid[0][0].tile.innerHTML = `C [${grid[0][0].coordinates}]`

    // grid[0][1].ch = "E"
    // grid[0][1].tile.innerHTML = `E [${grid[0][1].coordinates}]`

    // grid[0][2].ch = "L"
    // grid[0][2].tile.innerHTML = `L [${grid[0][2].coordinates}]`

    // grid[0][3].ch = "Z"
    // grid[0][3].tile.innerHTML = `Z [${grid[0][3].coordinates}]`

    // grid[1][0].ch = "W"
    // grid[1][0].tile.innerHTML = `W [${grid[1][0].coordinates}]`

    // grid[1][1].ch = "R"
    // grid[1][1].tile.innerHTML = `R [${grid[1][1].coordinates}]`

    // grid[1][2].ch = "I"
    // grid[1][2].tile.innerHTML = `I [${grid[1][2].coordinates}]`

    // grid[1][3].ch = "Y"
    // grid[1][3].tile.innerHTML = `Y [${grid[1][3].coordinates}]`

    // grid[2][0].ch = "L"
    // grid[2][0].tile.innerHTML = `L [${grid[2][0].coordinates}]`

    // grid[2][1].ch = "M"
    // grid[2][1].tile.innerHTML = `M [${grid[2][1].coordinates}]`

    // grid[2][2].ch = "R"
    // grid[2][2].tile.innerHTML = `R [${grid[2][2].coordinates}]`

    // grid[2][3].ch = "P"
    // grid[2][3].tile.innerHTML = `P [${grid[2][3].coordinates}]`

    // grid[3][0].ch = "F"
    // grid[3][0].tile.innerHTML = `F [${grid[3][0].coordinates}]`

    // grid[3][1].ch = "Y"
    // grid[3][1].tile.innerHTML = `Y [${grid[3][1].coordinates}]`

    // grid[3][2].ch = "M"
    // grid[3][2].tile.innerHTML = `M [${grid[3][2].coordinates}]`

    // grid[3][3].ch = "S"
    // grid[3][3].tile.innerHTML = `S [${grid[3][3].coordinates}]`

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
    return grid
}

export function findWords(gridNode, tree) {
    //gridNode could be my Adam
    const words = [];
    //pos 2 of all queued is the path from original gridNode to currentNode
    //use pos 2 to key into ancestory to set up next nodes
    const queue = [[tree, gridNode, [gridNode]]];

    while (queue.length) {
        let ele = queue.shift();
        if (ele[0].complete) {
            let currentWord = fetchWord(ele[0])
            if (!words.includes(currentWord)) {
                words.push(currentWord)
            }
        }
        let visitedNodes = ele[2].slice()
        for (let i = 0; i < ele[1].neighbors.length; i++) {
            if (!visitedNodes.includes(ele[1].neighbors[i]) &&
                !ele[2].includes(ele[1].neighbors[i])) {

                let path = ele[2].slice()
                path.push(ele[1].neighbors[i])
                visitedNodes.push(ele[1].neighbors[i])

                let char = ele[1].neighbors[i].ch
                let subTree = ele[0]
                if (subTree.map[char]) {
                    subTree = subTree.map[char];
                    
                    let currentNode = gridNode.ancestory
                    //key into ancestory until at the right position
                    for (let x = 1; x < ele[2].length; x++) {
                        if (currentNode.children[ele[2][x].coordinates]) {
                            currentNode = currentNode.children[ele[2][x].coordinates]
                        }
                    }
                    currentNode.children[ele[1].neighbors[i].coordinates] = {
                        node: ele[1].neighbors[i],
                        complete: subTree.complete,
                        children: {}
                    }

                    queue.push([subTree, ele[1].neighbors[i], path])
                }
            }
        }
    }
    console.log(words)
    console.log(gridNode.ancestory)
    return words
}