
export function modal() {
    const modalBtn = document.querySelector('.modal-button');
    const modalBg = document.querySelector('.modal-bg');
    const modalClose = document.querySelector('.modal-close');
    const modalChild = document.querySelector('.modal-child');

    modalBtn.addEventListener('click', function() {
        modalBg.classList.add('bg-active')
        // modalChild.innerHTML = "TESTING"
    })

    modalClose.addEventListener('click', function() {
        modalBg.classList.remove('bg-active');
    })
}

export function timer(grid) {
    const countdownEl = document.querySelector('.countdown');
    const modalChild = document.querySelector('.modal-child')
    const modalBg = document.querySelector('.modal-bg')
    console.log(grid)

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

    let time = 120;
    let t = setInterval(updateCountdown, 1000);
    let stop = false;

    function updateCountdown() {
        const minutes = Math.floor(time / 60)
        let seconds = time % 60;

        seconds = seconds < 10 ? '0' + seconds : seconds;

        countdownEl.innerHTML = `${minutes}:${seconds}`

        if (time > 0) time--;

        //open the modal and show the score, whether user passed the stage and all the possible words
        if (time === 0 && !stop) {
            gameOverModal(grid, miniGrid)
            stop = true;

            modalBg.classList.add('bg-active')
        }
    }
}

export function gameOverModal(grid, miniGrid) {
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

    console.log(modalChild)
}

//this function should return the array of mini divs that show the paths
export function wordPaths(rootNode, miniBoard) {
    //create the mini game board to then draw the line over it to show the path
    const currentPathsOuter = document.createElement('div');
    currentPathsOuter.className = 'current-paths-outer'

    const currentPathsInner = document.createElement('div');
    currentPathsInner.className = 'current-paths-inner'

    const title = document.createElement('p')
    title.className = 'path-title'
    title.innerHTML = `All possible words with ${rootNode.node.ch} at ${rootNode.node.coordinates}`
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
            let miniBoardContainer = document.createElement('div')
            let [word, svgContainer] = drawLine(currentNode)

            wordContainer.className = "mini-word-container"
            wordContainer.innerHTML = word

            miniBoardCopy.append(svgContainer)

            miniBoardContainer.className = "mini-board-container"
            miniBoardContainer.append(miniBoardCopy)
            miniBoardContainer.append(wordContainer)

            if (currentNode.found) {
                miniBoardContainer.style.backgroundColor = "yellow"
            }

            currentPathsInner.append(miniBoardContainer)
        }
    }

    currentPathsOuter.appendChild(currentPathsInner)
    return currentPathsOuter
}

export function drawLine(currentNode) {
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