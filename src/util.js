
export function modal() {
    const modalBtn = document.querySelector('.modal-button');
    const modalBg = document.querySelector('.modal-bg');
    const modalClose = document.querySelector('.modal-close');
    const modalChild = document.querySelector('.modal-child');
    const modalTitle = document.querySelector('.modal-title');

    const modalInner = document.querySelector('.modal-inner');
    
    modalBtn.addEventListener('click', function() {
        //get rid of any other divs in modal and only show instructions (for now)
        if (modalInner.children.length < 2) {
            modalInner.removeChild(modalInner.lastElementChild)
        }

        modalBg.classList.add('bg-active')
        modalTitle.innerHTML = "INSTRUCTIONS"
        modalChild.innerHTML = "-Make as many words as you can by swiping through adjacent tiles.<br>-Only words that are 3 letters or longer will be accepted.<br>-You can repeat words so long as you use a different arrangement of letters."
    })

    modalClose.addEventListener('click', function() {
        modalBg.classList.remove('bg-active');
    })
}

export function timer(grid, completeNodes) {
    const countdownEl = document.querySelector('.countdown');
    const modalChild = document.querySelector('.modal-child')
    const modalBg = document.querySelector('.modal-bg')

    let miniGrid = []
    grid.forEach(row => {
        let miniRow = []
        row.forEach(ancNode => {
            let miniTile = document.createElement('div')
            let innerMiniTileContainer = document.createElement('div')
            let innerMiniTile = document.createElement('div')
            miniTile.className = "mini-tile";
            innerMiniTileContainer.className = "inner-mini-tile-container"
            innerMiniTile.className = "inner-mini-tile"
            innerMiniTile.innerHTML = ancNode.node.ch

            innerMiniTileContainer.appendChild(innerMiniTile)
            miniTile.appendChild(innerMiniTileContainer)
            miniRow.push(miniTile)
        })
        miniGrid.push(miniRow)
    })

    // let time = 120;
    let t = setInterval(updateCountdown, 1000);
    let stop = false;

    function updateCountdown() {
        const minutes = Math.floor(window.time / 60)
        let seconds = window.time % 60;

        seconds = seconds < 10 ? '0' + seconds : seconds;

        countdownEl.innerHTML = `${minutes}:${seconds}`

        if (window.time > 0) window.time--;

        //open the modal and show the score, whether user passed the stage and all the possible words
        if (window.time === 0 && !stop) {
            gameOverModal(grid, miniGrid, completeNodes)
            stop = true;

            modalBg.classList.add('bg-active')
        }
    }
}

//I could have this function return whether user passed the stage or not.
//If pass then we reset time and allow gamePoints to persist
//Otherwise don't even render the next stage button
export function gameOverModal(grid, miniGrid, completeNodes) {

    const modalTitle = document.querySelector('.modal-title')
    const modalChild = document.querySelector('.modal-child')
    const modalInner = document.querySelector('.modal-inner')
    let gamePoints = parseInt(document.querySelector('.gamepoints').innerHTML)

    let totalPoints = 0;
    let passStage = false;

    const allPaths = document.createElement('div');
    const completeCells = [];
    const deadCells = [];
    allPaths.className = "all-paths"
    //grab each root ancestory node and return the mini paths with all words
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            //I am passing each root Ancestory Node from here.
            let rootNode = grid[i][j]
            let tile = null
            let [div, completeCell, deadCell, cellTotalPoints] = wordPaths(rootNode, miniGrid, completeNodes)
            if (completeCell) {
                tile = grid[i][j].node.innerTileContainer.cloneNode(true)
                completeCells.push([tile, cellTotalPoints])

                totalPoints += cellTotalPoints + 50000;
            } else if (deadCell) {
                tile = grid[i][j].node.innerTileContainer.cloneNode(true)
                deadCells.push(tile)
            }
            allPaths.appendChild(div)
        }
    }

    let totalBonusPoints = 0;

    if (completeCells.length) {
        let completeCellsDiv = document.createElement('div');
        completeCellsDiv.className = "complete-cells-div"
        let innerCompleteCellsDiv = document.createElement('div')
        innerCompleteCellsDiv.className = "inner-complete-cells-div"
        let cellsDivTitle = document.createElement('div')
        cellsDivTitle.className = "cells-div-title"
        let cellsDivBigScore = document.createElement('div')
        cellsDivBigScore.className = "cells-div-big-score"
        let cellsDivSmallScore = document.createElement('div')
        cellsDivSmallScore.className = "cells-div-small-score"
        let cellsDivTitleContainer = document.createElement('div');
        cellsDivTitleContainer.className = "cells-div-title-container"
        let cellsDiv = document.createElement('div')
        cellsDiv.className = "cells-div"

        let miniTotalPoints = 0;

        completeCells.forEach(arr => {
            let [cell, cellTotalPoints] = arr
            let innerCellsDiv = document.createElement('div')
            innerCellsDiv.className = "inner-cells-div"
            innerCellsDiv.backgroundColor = "hsla(137, 100%, 45%, 0.7)"
            let cellScoreDiv = document.createElement('div')
            cellScoreDiv.className = "cell-score-div"
            cellScoreDiv.innerHTML = "+5000 points"
            let miniCellScoreDiv = document.createElement('div')
            miniCellScoreDiv.className = "mini-cell-score-div"
            miniCellScoreDiv.innerHTML = `+${cellTotalPoints} points`
            innerCellsDiv.appendChild(cell)
            innerCellsDiv.appendChild(miniCellScoreDiv)
            innerCellsDiv.appendChild(cellScoreDiv)
            cellsDiv.appendChild(innerCellsDiv)

            miniTotalPoints += cellTotalPoints;
        })

        cellsDivTitle.innerHTML = "COMPLETE!"
        cellsDivSmallScore.innerHTML = `+${miniTotalPoints} points`
        cellsDivBigScore.innerHTML = `+${completeCells.length * 5000} points`

        cellsDivTitleContainer.appendChild(cellsDivTitle)
        cellsDivTitleContainer.appendChild(cellsDivSmallScore)
        cellsDivTitleContainer.appendChild(cellsDivBigScore)

        innerCompleteCellsDiv.appendChild(cellsDivTitleContainer)
        
        innerCompleteCellsDiv.appendChild(cellsDiv)
        completeCellsDiv.appendChild(innerCompleteCellsDiv)
        modalInner.appendChild(completeCellsDiv)

        totalBonusPoints = miniTotalPoints + (completeCells.length * 5000)
    }

    const innerContainer = document.createElement('div')
    innerContainer.className = 'inner-container'
    const messageDiv = document.createElement('div')
    messageDiv.className = 'message-div'
    const buttonContainer = document.createElement('div')
    buttonContainer.className = 'button-container'
    const scoreContainer = document.createElement('div')
    const messageButtonDiv = document.createElement('div')
    messageButtonDiv.className = 'message-button-div'
    
    scoreContainer.className = 'score-container'
    const scoreInnerContainer = document.createElement('div')
    scoreInnerContainer.className = 'score-inner-container'
    const prevScore = document.createElement('div')
    prevScore.className = 'prev-score'
    const stageScore = document.createElement('div')
    stageScore.className = 'stage-score'
    const bonusPoints = document.createElement('div')
    bonusPoints.className = 'bonus-points'
    const totalStagePoints = document.createElement('div')
    totalStagePoints.className = 'total-stage-points'
    const scoreTitles = document.createElement('div')
    scoreTitles.className = 'score-titles'
    const prevScoreTitle = document.createElement('div')
    prevScoreTitle.className = 'score-title'
    const stageScoreTitle = document.createElement('div')
    stageScoreTitle.className = 'score-title'
    const bonusScoreTitle = document.createElement('div')
    bonusScoreTitle.className = 'score-title'
    const totalScoreTitle = document.createElement('div')
    totalScoreTitle.className = 'score-title'

    prevScoreTitle.innerHTML = "Previous Score"
    stageScoreTitle.innerHTML = "Stage Score"
    bonusScoreTitle.innerHTML = "Total Bonus Points"
    totalScoreTitle.innerHTML = "Total Score"

    scoreTitles.append(prevScoreTitle)
    scoreTitles.append(stageScoreTitle)
    scoreTitles.append(bonusScoreTitle)
    scoreTitles.append(totalScoreTitle)

    let pastScore = parseInt(window.localStorage.getItem('gameScore'))

    prevScore.innerHTML = pastScore
    stageScore.innerHTML = gamePoints - pastScore;
    bonusPoints.innerHTML = totalBonusPoints;
    totalStagePoints.innerHTML = gamePoints + totalBonusPoints;
    
    scoreInnerContainer.append(prevScore)
    scoreInnerContainer.append(stageScore)
    scoreInnerContainer.append(bonusPoints)
    scoreInnerContainer.append(totalStagePoints)

    scoreContainer.append(scoreTitles)
    scoreContainer.append(scoreInnerContainer)
    
    if (gamePoints + totalBonusPoints - pastScore >= 15000) {
        passStage = true;
    }
    
    if (passStage) {
        const nextStageButton = document.createElement('button')
        nextStageButton.className = 'next-stage-button'
        nextStageButton.innerHTML = "NEXT STAGE"
        
        nextStageButton.addEventListener('click', () => {
            //store current score into local storage
            window.localStorage.setItem('gameScore', gamePoints)
            window.location.reload()
            
        })
        modalTitle.innerHTML = 'STAGE PASSED!'
        buttonContainer.append(nextStageButton)
    } else {
        modalTitle.innerHTML = 'STAGE FAILED!'
    }

    const restartButton = document.createElement('button');
    restartButton.className = 'modal-restart-button'
    restartButton.innerHTML = "RESTART"
    restartButton.addEventListener('click', () => {
        localStorage.clear()
        window.localStorage.setItem('gameScore', 0);
        window.location.reload()
    })
    buttonContainer.append(restartButton)
    
    messageDiv.innerHTML = "15,000 points needed to move on to next stage"

    messageButtonDiv.append(messageDiv)
    messageButtonDiv.append(buttonContainer)

    innerContainer.append(messageButtonDiv)
    innerContainer.append(scoreContainer)

    while (modalChild.firstChild) {
        modalChild.removeChild(modalChild.firstChild)
    }

    modalChild.append(modalTitle)
    modalChild.append(innerContainer)

    modalInner.appendChild(allPaths)
}

//this function should return the array of mini divs that show the paths
export function wordPaths(rootNode, miniGrid, completeNodes) {
    let miniBoard = document.createElement('div')
    let deadCell = true;
    let completeCell = false;
    let totalPoints = 0

    miniBoard.className = "mini-board";
    for (let i = 0; i < miniGrid.length; i++) {
        for (let j = 0; j < miniGrid[0].length; j++) {
            miniGrid[j][i].style.left = i * 25 + "px";
            miniGrid[j][i].style.top = j * 25 + "px";
            miniBoard.append(miniGrid[j][i])
        }
    }
    //create the mini game board to then draw the line over it to show the path
    const currentPathsOuter = document.createElement('div');
    currentPathsOuter.className = 'current-paths-outer'

    const currentPathsInner = document.createElement('div');
    currentPathsInner.className = 'current-paths-inner'

    const titleContainer = document.createElement('div')
    titleContainer.className = "title-container"

    const totalTilePointsDiv = document.createElement('div')
    totalTilePointsDiv.className = 'tile-points-div'

    const title = document.createElement('div')
    title.className = 'path-title'
    title.innerHTML = `All possible words with ${rootNode.node.ch} at ${rootNode.node.coordinates}`

    //I need to BFS through the rootNode tree to find all words
    let queue = [rootNode];
    while (queue.length) {
        let currentNode = queue.shift();
        
        for (const key in currentNode.children) {
            queue.push(currentNode.children[key])
        }
        
        //I need to create new mini svg containers to place over the mini game boards
        if (currentNode.complete) {
            deadCell = false;
            totalPoints += currentNode.points
            let miniGridCopy = []
            for (let y = 0; y < miniGrid.length; y++) {
                let row = []
                for (let x = 0; x < miniGrid[0].length; x++) {
                    let tileCopy = miniGrid[y][x].cloneNode(true)
                    row.push(tileCopy)
                }
                miniGridCopy.push(row);
            }
            
            let miniBoardContainer = drawLine(currentNode, miniGridCopy)
            
            currentPathsInner.append(miniBoardContainer)
        }
    }
    
    let [x, y] = rootNode.node.coordinates.split(',')
    if (!completeNodes[`${x},${y}`].length && !deadCell) {
        currentPathsOuter.style.backgroundColor = "hsla(137, 100%, 45%, 0.4)"
        totalTilePointsDiv.innerHTML = `+${totalPoints}!`
        totalTilePointsDiv.style.backgroundColor = "hsla(137, 100%, 45%, 0.7)"
        completeCell = true;
    } else if (deadCell) {
        currentPathsOuter.style.backgroundColor = "hsla(0, 0%, 0%, 0.4)"
        totalTilePointsDiv.innerHTML = "0"
        totalTilePointsDiv.style.backgroundColor = "hsla(0, 0%, 0%, 0.6"
        totalPoints = 0
    } else {
        totalTilePointsDiv.innerHTML = `${totalPoints}`
        totalPoints = 0
    }
    titleContainer.appendChild(title)
    titleContainer.appendChild(totalTilePointsDiv)
    currentPathsOuter.appendChild(titleContainer)
    titleContainer.appendChild(totalTilePointsDiv)
    currentPathsOuter.appendChild(currentPathsInner)
    return [currentPathsOuter, completeCell, deadCell, totalPoints]
}

export function drawLine(currentNode, miniGrid) {
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    let miniBoardCopy = document.createElement('div');
    miniBoardCopy.className = "mini-board"
    let wordContainer = document.createElement('div')
    wordContainer.className = "mini-word-container"
    let miniBoardContainer = document.createElement('div')
    miniBoardContainer.className = "mini-board-container"
    let wordContainerShade = document.createElement('div')
    wordContainerShade.className = "word-container-shade"
    let pointsContainer = document.createElement('div')
    pointsContainer.className = "mini-word-container"
    let pointsContainerShade = document.createElement('div')
    pointsContainerShade.className = "word-container-shade"
    let pointOuterContainer = document.createElement('div')
    pointOuterContainer.className = "point-outer-container"
    let wordOuterContainer = document.createElement('div')
    wordOuterContainer.className = "mini-word-outer-container"
    let word = currentNode.node.ch
    let lineColor = "white"
    let tileColor = "hsla(60, 100%, 65%, 0.8)"
    let pointColor = "hsla(60, 100%, 65%, 0.8)"
    let [x, y] = currentNode.node.coordinates.split(',')
    let currentTile = miniGrid[y][x].firstChild
    currentTile.firstChild.style.backgroundColor = tileColor
    currentTile.style.width = "19px"
    currentTile.style.height = "19px"

    let points = currentNode.points
    let found = false;
    if (currentNode.found) {
        found = true;
        tileColor = "hsla(137, 100%, 45%, 0.4)"
        pointColor = "hsla(137, 100%, 45%, 0.4)"
        currentTile.firstChild.style.backgroundColor = tileColor

        points = `+${points}!`
    }
    wordContainerShade.style.backgroundColor = tileColor
    pointsContainerShade.style.backgroundColor = pointColor
    pointsContainerShade.innerHTML = points;
    pointsContainer.append(pointsContainerShade)
    
    svg.setAttribute('width', '100');
    svg.setAttribute('height', '100');
    svg.style.zIndex = 5
    
    while(currentNode.parent) {
        let newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        let [x1, y1] = currentNode.node.coordinates.split(',');
        let [x2, y2] = currentNode.parent.node.coordinates.split(',');
        newLine.setAttribute('class', 'mini-game-line')
        newLine.setAttribute('stroke', lineColor)
        newLine.setAttribute('x1', `${x1 * 25 + 12.5}`)
        newLine.setAttribute('y1', `${y1 * 25 + 12.5}`)
        newLine.setAttribute('x2', `${x2 * 25 + 12.5}`)
        newLine.setAttribute('y2', `${y2 * 25 + 12.5}`)
        svg.appendChild(newLine)
        
        word = currentNode.parent.node.ch + word;
        currentNode = currentNode.parent
        let [x, y] = currentNode.node.coordinates.split(',')
        currentTile = miniGrid[y][x].firstChild
        currentTile.firstChild.style.backgroundColor = tileColor
        currentTile.style.width = "19px";
        currentTile.style.height = "19px";
    }
    
    for (let i = 0; i < miniGrid.length; i++) {
        for (let j = 0; j < miniGrid[0].length; j++) {
            miniBoardCopy.appendChild(miniGrid[i][j])
        }
    }
    pointsContainer.style.margin = "none"
    pointOuterContainer.append(pointsContainer)

    wordContainerShade.innerHTML = word
    wordContainer.append(wordContainerShade)
    wordOuterContainer.append(wordContainer)
    miniBoardCopy.append(svg)
    miniBoardContainer.append(pointOuterContainer)
    miniBoardContainer.append(miniBoardCopy)
    miniBoardContainer.append(wordOuterContainer)
    if (found) {
        miniBoardContainer.style.boxShadow = "5px -3px 10px"
    } else {
        miniBoardContainer.style.boxShadow = "5px 5px 10px inset"
        let shadowContainer = document.createElement('div');
        shadowContainer.className = "shadow-container"
        miniBoardContainer.appendChild(shadowContainer)
    }

    let definitonsDiv = document.createElement('div')
    definitonsDiv.className = "definitions-div"
    definitonsDiv.innerHTML = currentNode.definitions[word]

    miniBoardContainer.appendChild(definitonsDiv)

    miniBoardContainer.addEventListener('mouseover', () => {
        definitonsDiv.classList.add('definitions-show')
    })

    miniBoardContainer.addEventListener('mouseleave', () => {
        definitonsDiv.classList.remove('definitions-show')
    })
    return miniBoardContainer
}