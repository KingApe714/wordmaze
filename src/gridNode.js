export function gridNode(coordinates) {
    this.neighbors = [];
    this.coordinates = coordinates;

    this.tile = document.createElement('div')
    let letter = "AABCDEEFGHIIJKLMNOOPQRSSTUUVWXYZ"[Math.floor(Math.random() * 32)]
    this.ch = letter;
    this.tile.className = "game-tile";
    this.tile.innerHTML = `${letter} [${coordinates}]`;
}

export function setUpGrid() {
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
            let gNode = new gridNode(`${i},${j}`)
            gNode.tile.style.left = j * 100 + "px";
            gNode.tile.style.top = i * 100 + "px";
            gameBoardContainer.appendChild(gNode.tile)
            row.push(gNode)
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
                    grid[i][j].neighbors.push(grid[x][y])
                }
            })
        }
    }
    return grid
}