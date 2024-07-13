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

    if (idx !== -1 && jdx !== -1 && (current.i !== idx || current.j !== jdx)) {
      console.log([idx, jdx]);
      current = ancestoryMatrix[idx][jdx];
      console.log(current);
    }
  });

  const calculateCoords = (touchEvent) => {
    const boardData = gameBoard.getBoundingClientRect();
    const height = boardData.height;
    const width = boardData.width;

    const top = boardData.top;
    const left = boardData.left;

    const i = touchEvent.clientY - top;
    const j = touchEvent.clientX - left;

    // make sure to account for the spaces between tiles
    // 3 - 22 | 28 - 47 | 53 - 72 | 78 - 97
    const numI = (i / height) * 100;
    const numJ = (j / width) * 100;

    const idx = isValid(numI) ? Math.floor((numI - 1) / 25) : -1;
    const jdx = isValid(numJ) ? Math.floor((numJ - 1) / 25) : -1;

    return [idx, jdx];
  };

  const isValid = (num) => {
    return (
      (num >= 3 && num <= 22) ||
      (num >= 28 && num <= 47) ||
      (num >= 53 && num <= 72) ||
      (num >= 78 && num <= 97)
    );
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
