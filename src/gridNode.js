import { fetchWord } from "./trie";

//lets try unnesting the ancestoryNode from inside of this node
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

    this.points = 100;
    this.found = false;

    //properly set up the word at the nodes that return a .complete
    //then at the node store the definition
    //later create an object with that references each node, all the words and their definitions
    
    this.words = []
    this.definitions = {}

    //everywhere this node appears in a clue word will be referenced here
    this.clueDivs = []
}

export function setUpGrid(root) {
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
    
    let gameWords = []
    let newGrid = []
    let completeNodes = {}
    while (gameWords.length < 70) {
        const grid = []
        newGrid = []
        gameWords = []
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
                    let x = n[0] + j;
                    let y = n[1] + i;
                    //handle edge cases
                    if (x >= 0 && x < grid.length && y >= 0 && y < grid[0].length) {
                        grid[j][i].neighbors.push(grid[x][y])
                    }
                })
            }
        }
    
        //find all gameWords, set up newGrid with ancestoryNodes, and set up completeNodes object
        for (let y = 0; y < grid.length; y++) {
            let row = [];
            for (let x = 0; x < grid[0].length; x++) {
                let arr = findWords(grid[y][x], root.map[grid[y][x].ch])
                row.push(arr[1])
                arr[0].forEach(word => {
                    if (!gameWords.includes(word)) {
                        gameWords.push(word)
                    }

                })
                completeNodes[arr[1].node.coordinates] = arr[2]
            }
            newGrid.push(row)
        }
        console.log(gameWords)
    }

    let setTiles = setUpTiles(newGrid, gameWords, completeNodes)

    let promises = [];

    gameWords.forEach(word => promises.push(dictionaryApi(word)))

    Promise.all(promises)
        .then(results => {
            let dictionary = {};
            results.forEach(res => {
                dictionary[res[0]] = res[1]
            })

            console.log(dictionary)

            for (let i = 0; i < newGrid.length; i++) {
                for (let j = 0; j < newGrid[i].length; j++) {
                    newGrid[i][j].words.forEach(word => {
                        if (dictionary[word]) {
                            newGrid[i][j].definitions[word] = dictionary[word]
                        }
                    })
                }
            }

            //I want to call the function that will set up the underscore container here
            //I need to pass to it newGrid
            setUpClues(newGrid)
        })
        .catch(err => console.log(err))

    // I don't want to call setUpTiles until gameWords is longer than 70 words
    return setTiles
}

async function dictionaryApi(word) {
    let definitionsAPI = "https://api.dictionaryapi.dev/api/v2/entries/en/"

    let response = await fetch(definitionsAPI+word)
    let json = await response.json()
    let definition = json[0] ? json[0].meanings[0].definitions[0].definition : "Sorry, no definition for this one, but we know it's a word.."
    return [
        word,
        definition
    ]
}

export function setUpClues(newGrid) {
    // let clueArray = [];

    //I want to loop through all of the nodes and set up a 2D array that has the letter
    //in pos 0 and the coordinates in pos 1
    //When user has completed a node then loop through the entire array and find where
    //the coordinates match the completed node and set the letter to visible
    for (let i = 0; i < newGrid.length; i++) {
        for (let j = 0; j < newGrid[0].length; j++) {
            let currentNode = newGrid[i][j]
            //I want to look at all possible words from currentNode
            // clueArray = clueArray.concat(findClueWords(newGrid, currentNode))

            findClueWords(newGrid, currentNode)
        }
    }

    // console.log(clueArray)
}

//findClueWords will populate the clueContainer for me
//it will also have the array with the references to all the letters and their coordinates
export function findClueWords(newGrid, rootNode) {

    let queue = [rootNode];
    const innerClueContainer = document.querySelector('.inner-clue-container')
    const definitionsContainer = document.querySelector('.definitions-container')
    // const clueArray = []

    while (queue.length) {
        let currentNode = queue.shift()
        let children = Object.values(currentNode.children)

        if (children.length) {
            queue = queue.concat(children)
        }

        //this is where I want to set up the logic for the clue container
        if (currentNode.complete) {
            let checkNode = currentNode
            let word = ""
            //arr should be a 2 dimensional array, pos 0 will be the letter displayed to user in the div
            //pos 1 is the coordinate of the letter
            let arr = []
            let clueWordContainer = document.createElement('div')
            clueWordContainer.className = 'clue-word-container'

            // let clueWordDefinition = document.createElement('div')
            // clueWordDefinition.className = 'clue-word-definition'

            while (checkNode) {
                let clueLetterContainer = document.createElement('div')
                let clueLetter = document.createElement('div')

                clueLetterContainer.className = 'clue-letter-container'
                clueLetter.className = 'clue-letter'

                // clueLetter.innerHTML = checkNode.node.ch
                clueLetterContainer.append(clueLetter)

                word = checkNode.node.ch + word
                
                arr.unshift([clueLetterContainer, checkNode.node.coordinates])

                //with this I should be able to just loop through the clueDivs array to find all
                //relevant divs
                let [x, y] = checkNode.node.coordinates.split(',')
                newGrid[y][x].clueDivs.push(clueLetterContainer)
                // checkNode.clueDivs.push(clueLetterContainer)

                checkNode = checkNode.parent
            }

            arr.forEach(ele => {
                clueWordContainer.append(ele[0])
            })

            console.log(rootNode.definitions[word])
            
            // clueWordDefinition.innerHTML = rootNode.definitions[word]

            
            // clueWordContainer.append(clueWordDefinition)
            
            clueWordContainer.addEventListener('mousedown', () => {
                // clueWordDefinition.classList.add('definitions-show')
                definitionsContainer.innerHTML = rootNode.definitions[word]
            })
        
            // clueWordContainer.addEventListener('mouseleave', () => {
                // clueWordDefinition.classList.remove('definitions-show')
            // })

            // clueArray.push(arr)
            innerClueContainer.append(clueWordContainer)
        }
    }

    // return clueArray
}

export function setUpTiles(grid, gameWords, completeNodes) {

    console.log(grid)
    //this grid is a grid full of ancestory nodes
    const gameBoardContainer = document.querySelector('.game-board-container')
    const gamePointsDiv = document.querySelector('.gamepoints')
    const countdownDiv = document.querySelector('.countdown')
    const pointExpression = document.querySelector('.point-expression')
    const countExpression = document.querySelector('.count-expression')
    const svgContainer = document.querySelector('.svg-container')
    const wordContainer = document.querySelector('.word-container')
    let mouseDown = false;
    let word = ""
    let selectedNodes = [];
    let line = [];
    let nodeAdam = null;
    let firstNode = null

    let gamePoints = 0;
    let foundWords = []

    let completedTiles = []

    //dead cells
    for (let key in completeNodes) {
        if (!completeNodes[key].length) {
            let [x,y] = key.split(',')
            grid[y][x].node.innerTileContainer.style.color = 'white'
            grid[y][x].node.innerTileContainer.style.filter = 'brightness(90%)'
        }
    }

    wordContainer.onselectstart = () => {
        return false;
    }
    
    gameBoardContainer.addEventListener("mousedown", () => {
        mouseDown = true;
        return false;
    })
    
    gameBoardContainer.addEventListener("mouseup", () => {

        //I might not need this anymore
        if (gameWords.includes(word) && !foundWords.includes(word)) {
            foundWords.push(word)
        }

        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[0].length; j++) {
                let gNode = grid[i][j].node;
                gNode.innerTile.classList.remove('selected-inner-tile-grow')
                gNode.innerTile.classList.remove('selected-inner-tile-shrink')
                gNode.innerTileContainer.classList.remove('selected-inner-tile')
                if (!completedTiles.includes(gNode)) {
                    gNode.innerTile.style.backgroundColor = "transparent"
                } else {
                    gNode.innerTile.style.backgroundColor = "rgba(0, 230, 65, 0.45)"
                }
                gNode.innerTile.style.width = "70px";
                gNode.innerTile.style.height = "70px";
                gNode.selected = false
            }
        }
        if (!nodeAdam.found && nodeAdam.complete && gameWords.includes(word)) {
            nodeAdam.found = true;
            let idx = completeNodes[firstNode].indexOf(nodeAdam)
            completeNodes[firstNode] = completeNodes[firstNode].slice(0, idx).concat(completeNodes[firstNode].slice(idx + 1))

            if (!completeNodes[firstNode].length) {
                //this signifies I've found all the words I can with this tile
                let [x, y] = firstNode.split(',')
                grid[y][x].node.innerTile.style.backgroundColor = "rgba(0, 230, 65, 0.45)"
                grid[y][x].node.innerTile.style.boxShadow = "3px 3px 10px white"

                completedTiles.push(grid[y][x].node)

                //TESTING CLUE DIVS
                console.log(grid[y][x])
                grid[y][x].clueDivs.forEach(div => {
                    div.firstChild.style.backgroundColor = "rgba(0, 230, 65, 0.45)"
                    div.firstChild.style.boxShadow = "1px .15px 4px white"

                    div.firstChild.innerHTML = grid[y][x].node.ch
                })
            }

            gamePoints += nodeAdam.points
            
            pointExpression.innerHTML = `+${nodeAdam.points}!!`;
            pointExpression.classList.add('point-shrink')
            setTimeout(() => {
                pointExpression.classList.remove('point-shrink')
                pointExpression.innerHTML = "";
                gamePointsDiv.innerHTML = gamePoints
            }, 900)
        }
        
        word = "";
        selectedNodes = [];
        line = [];
        nodeAdam = null;
        firstNode = null;
        wordContainer.style.display = "none"
    

        while (svgContainer.firstChild) {
            svgContainer.removeChild(svgContainer.firstChild)
        }
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
                    // gNode.tile.style.backgroundColor = "blue";
                    gNode.innerTileContainer.classList.add('selected-inner-tile')

                    nodeAdam = grid[i][j]
                    firstNode = `${j},${i}`
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
                        newLine.setAttribute('class', 'game-line')
                        newLine.setAttribute('x1', `${x1 * 100 + 50}`)
                        newLine.setAttribute('y1', `${y1 * 100 + 50}`)
                        newLine.setAttribute('x2', `${x2 * 100 + 50}`)
                        newLine.setAttribute('y2', `${y2 * 100 + 50}`)
                        line.push(newLine)
                        svgContainer.appendChild(newLine)

                        word += gNode.ch;
                        selectedNodes.push(gNode)
                        // gNode.tile.style.backgroundColor = "blue"
                        
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
                                    // currentNode.tile.style.backgroundColor = "white";
                                    currentNode.innerTileContainer.classList.remove('selected-inner-tile')
                                    currentNode.innerTile.classList.remove('selected-inner-tile-shrink')
                                    currentNode.innerTile.classList.remove('selected-inner-tile-grow')
                                    currentNode.innerTile.style.backgroundColor = "transparent"
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
                        if (svgContainer.lastChild) svgContainer.removeChild(svgContainer.lastChild)
                    }
                    for (let i = 0; i < selectedNodes.length; i++) {
                        let node1 = selectedNodes[i]
                        node1.innerTileContainer.classList.add('selected-inner-tile')
                        //now check to see if I have a complete word or not
                        wordContainer.style.display = "flex"
                        if (lastNode === nodeAdam.node && nodeAdam.complete) {
                            node1.innerTile.classList.remove('selected-inner-tile-shrink')
                            node1.innerTile.classList.add('selected-inner-tile-grow')

                            if (nodeAdam.found) {
                                //user has found this word in this path
                                colorChange(line, "yellow", wordContainer, word, node1, "hsla(60, 100%, 75%, 0.6)")
                            } else {
                                //user has found a word on a new path
                                colorChange(line, "white", wordContainer, `${word}  (+${nodeAdam.points})!`, node1, "hsla(137, 100%, 45%, 0.45)")
                            }
                        } else {
                            node1.innerTile.classList.remove('selected-inner-tile-grow')
                            node1.innerTile.classList.add('selected-inner-tile-shrink')
                            colorChange(line, "red", wordContainer, word, node1, "hsla(5, 90%, 51%, 0.6)")
                        }
                    }
                    gNode.selected = true
                }
            })
            
            gNode.innerTile.addEventListener("mouseup", () => {
                mouseDown = false;
                gNode.selected = false;
            })
            gameBoardContainer.appendChild(gNode.tile)
        }
    }

    return [grid, completeNodes, gamePoints]
}

export function colorChange(line, color, wordContainer, word, node, tileColor) {
    wordContainer.innerHTML = word;
    wordContainer.style.backgroundColor = tileColor
    node.innerTile.style.backgroundColor = tileColor
    return line.forEach(el => {
        el.style.stroke = color
    })
}

export function findWords(gridNode, tree) {
    //gridNode could be my Adam
    const words = [];
    //pos 2 of all queued is the path from original gridNode to currentNode
    //use pos 2 to key into ancestory to set up next nodes
    let rootAncNode = new ancestoryNode(gridNode);
    const queue = [[tree, rootAncNode, [gridNode]]];
    let completeNodes = []

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

                    //the point system
                    newAncNode.points = newAncNode.parent.points * 2;

                    //the complete and found words system
                    if (subTree.complete) {
                        completeNodes.push(newAncNode)
                    }

                    queue.push([subTree, newAncNode, path])
                }
            }
        }
    }

    rootAncNode.words = words

    return [words, rootAncNode, completeNodes]
}