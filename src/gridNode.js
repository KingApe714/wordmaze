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

    //for testing
    grid[0][0].ch = "C"
    grid[0][0].tile.innerHTML = `C [${grid[0][0].coordinates}]`

    grid[0][1].ch = "E"
    grid[0][1].tile.innerHTML = `E [${grid[0][1].coordinates}]`

    grid[0][2].ch = "L"
    grid[0][2].tile.innerHTML = `L [${grid[0][2].coordinates}]`

    grid[0][3].ch = "Z"
    grid[0][3].tile.innerHTML = `Z [${grid[0][3].coordinates}]`

    grid[1][0].ch = "W"
    grid[1][0].tile.innerHTML = `W [${grid[1][0].coordinates}]`

    grid[1][1].ch = "R"
    grid[1][1].tile.innerHTML = `R [${grid[1][1].coordinates}]`

    grid[1][2].ch = "I"
    grid[1][2].tile.innerHTML = `I [${grid[1][2].coordinates}]`

    grid[1][3].ch = "Y"
    grid[1][3].tile.innerHTML = `Y [${grid[1][3].coordinates}]`

    grid[2][0].ch = "L"
    grid[2][0].tile.innerHTML = `L [${grid[2][0].coordinates}]`

    grid[2][1].ch = "M"
    grid[2][1].tile.innerHTML = `M [${grid[2][1].coordinates}]`

    grid[2][2].ch = "R"
    grid[2][2].tile.innerHTML = `R [${grid[2][2].coordinates}]`

    grid[2][3].ch = "P"
    grid[2][3].tile.innerHTML = `P [${grid[2][3].coordinates}]`

    grid[3][0].ch = "F"
    grid[3][0].tile.innerHTML = `F [${grid[3][0].coordinates}]`

    grid[3][1].ch = "Y"
    grid[3][1].tile.innerHTML = `Y [${grid[3][1].coordinates}]`

    grid[3][2].ch = "M"
    grid[3][2].tile.innerHTML = `M [${grid[3][2].coordinates}]`

    grid[3][3].ch = "S"
    grid[3][3].tile.innerHTML = `S [${grid[3][3].coordinates}]`

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