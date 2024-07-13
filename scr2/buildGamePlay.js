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
    current.innerGameDiv.style.backgroundColor = "rgba(255, 0, 0, 0.4)";
    current.visited = true;
    current.lastVisited = true;
    highlightPath(current, current);
  });

  // this is the exact same code as mouse up. consider consolidating
  gameBoard.addEventListener("touchend", (e) => {
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

  // need to finish working out the draw logic and we're done!!
  gameBoard.addEventListener("touchmove", (e) => {
    e.preventDefault();

    const [idx, jdx] = calculateCoords(e.touches[0]);

    if (idx !== -1 && jdx !== -1 && (current.i !== idx || current.j !== jdx)) {
      const node = ancestoryMatrix[idx][jdx];

      if (
        node.active &&
        !node.visited &&
        Object.values(node.neighbors).some((nei) => nei.lastVisited)
      ) {
        node.visited = true;

        // loop to find the last visited neighbor
        for (const key in node.neighbors) {
          const nei = node.neighbors[key];

          if (nei.lastVisited) {
            nei.lastVisited = false;

            const line = drawLine(node.innerGameDiv, nei.innerGameDiv);
            node.lines = [...nei.lines, line];
            updateLine(node, "rgba(255, 0, 0, 0.4)");

            const key = `${node.i},${node.j}`;

            if (nei.current !== null && nei.current.children.has(key)) {
              // here I know that I've moved into a tile that is a child of the last
              node.current = nei.current.children.get(key);
              highlightPath(node, node.current);
            } else {
              // here I know that user is not spelling a word
              nullifyAllNodes();
            }
          }
        }
      }
      node.lastVisited = true;
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

  const highlightPath = (node, current) => {
    if (current.word) {
      if (!current.found) {
        updateLine(node, "rgba(0, 128, 0, 0.5)");
      } else {
        updateLine(node, "rgba(255, 255, 0, 0.4)");
      }
    }
  };

  const updateLine = (node, color) => {
    for (const line of node.lines) {
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

  const drawLine = (div1, div2) => {
    const svg = document.getElementById("line-canvas");

    const rect1 = div1.getBoundingClientRect();
    const rect2 = div2.getBoundingClientRect();

    // Calculate the start and end points of the line
    const x1 = rect1.left + rect1.width / 2;
    const y1 = rect1.top + rect1.height / 2;
    const x2 = rect2.left + rect2.width / 2;
    const y2 = rect2.top + rect2.height / 2;

    // Create an SVG line element
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", "red");
    line.setAttribute("stroke-width", "2");

    svg.appendChild(line);

    return line;
  };

  const nullifyAllNodes = () => {
    for (let i = 0; i < this.ancestoryMatrix.length; i += 1) {
      for (let j = 0; j < this.ancestoryMatrix[i].length; j += 1) {
        const node = this.ancestoryMatrix[i][j];
        node.current = null;
      }
    }
  };
};
