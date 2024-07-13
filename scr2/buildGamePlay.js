export const gamePlay = (ancestoryMatrix) => {
  const gameBoard = document.querySelector(".inner-game-container");
  const svg = document.getElementById("line-canvas");

  gameBoard.addEventListener("mousedown", (e) => {
    e.preventDefault();

    for (let i = 0; i < 4; i += 1) {
      for (let j = 0; j < 4; j += 1) {
        const node = ancestoryMatrix[i][j];
        node.active = true;
      }
    }
  });

  gameBoard.addEventListener("mouseup", (e) => {
    e.preventDefault();

    svg.innerHTML = "";

    for (let i = 0; i < 4; i += 1) {
      for (let j = 0; j < 4; j += 1) {
        const node = ancestoryMatrix[i][j];

        // here I am looking at a tile that cereates a word
        if (node.lastVisited && node.current && node.current.word) {
          const rootNode = node.current.rootNode || node;
          const current = node.current;

          if (!current.found) rootNode.foundWordCount += 1;
          current.found = true;
          current.clueDiv.style.backgroundColor = "green";

          if (rootNode.foundWordCount === rootNode.wordCount) {
            rootNode.complete = true;
            rootNode.gameDiv.style.filter = "hue-rotate(90deg) saturate(200%)";

            for (const div of rootNode.clueCharContainers) {
              div.style.backgroundColor = "green";
            }
          }
        }

        node.active = false;
        node.visited = false;
        node.lastVisited = false;
        node.current = node;
        node.lines.length = 0;
        node.innerGameDiv.style.backgroundColor = "";
      }
    }
  });

  const lines = [];
  let current = null;

  gameBoard.addEventListener("touchstart", (e) => {
    e.preventDefault();

    for (let i = 0; i < 4; i += 1) {
      for (let j = 0; j < 4; j += 1) {
        const node = ancestoryMatrix[i][j];
        node.active = true;
      }
    }

    const [idx, jdx] = calculateCoords(e.touches[0]);

    current = ancestoryMatrix[idx][jdx];

    console.log(current);
  });

  gameBoard.addEventListener("touchmove", (e) => {
    e.preventDefault();

    const [idx, jdx] = calculateCoords(e.touches[0]);

    // this method is now successfully capturing the coordinates as I need them while the user is swiping.
    // Now I need to ensure that we only calculate user building a word if and only if we are entering new coordinates.
    // consider an if statement that takes current.i and idx and current.j and jdx and compares them.

    if (current.i !== idx || current.j !== jdx) {
      console.log([idx, jdx]);
      current = ancestoryMatrix[idx][jdx];
    }
  });

  // I need to remove the discrepency from the corners. Each tile isn't absolutely 25% of the board, they are actually smaller than 25%. they are 20% of the board. this means that 2.5% above the tile and 2.5% below the tile does not have to be listened for. If I don't do this then I won't be able to able to make diagonal moves
  // this function can handle this for me. I need to figure out how to make it do that for me and then return -1 on either the idx or the jdx or both if they are not within the bound of the tile.
  // I may have to make it listen for a smaller distance as the swipe area is quite big
  const calculateCoords = (touchEvent) => {
    const boardData = gameBoard.getBoundingClientRect();
    const height = boardData.height;
    const width = boardData.width;

    const top = boardData.top;
    const left = boardData.left;

    const i = touchEvent.clientY - top;
    const j = touchEvent.clientX - left;

    const numI = (i / height) * 100;
    const numJ = (j / width) * 100;

    const idx = Math.floor((numI - 1) / 25);
    const jdx = Math.floor((numJ - 1) / 25);

    return [idx, jdx];
  };

  const highlightPath = (node) => {
    if (node.word) {
      if (!node.found) {
        updateLine("rgba(0, 128, 0, 0.5)");
      } else {
        updateLine("rgba(255, 255, 0, 0.4)");
      }
    }
  };

  const updateLine = (color) => {
    for (const line of lines) {
      line.setAttribute("stroke", color);
    }

    for (let i = 0; i < ancestoryMatrix.length; i += 1) {
      for (let j = 0; j < ancestoryMatrix[i].length; j += 1) {
        const node = ancestoryMatrix[i][j];
        if (node.visited) {
          node.innerGameDiv.style.backgroundColor = color;
        }
      }
    }
  };
};
