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

  const boardData = gameBoard.getBoundingClientRect();
  const height = boardData.height;
  const width = boardData.width;

  gameBoard.addEventListener("touchstart", (e) => {
    e.preventDefault();

    for (let i = 0; i < 4; i += 1) {
      for (let j = 0; j < 4; j += 1) {
        const node = ancestoryMatrix[i][j];
        node.active = true;
      }
    }

    console.log(e.touches[0]);

    const i = e.touches[0].clientY - top;
    const j = e.touches[0].clientX - left;

    const numI = (i / height) * 100;
    const numJ = (j / width) * 100;

    const idx = Math.floor((numI - 1) / 25);
    const jdx = Math.floor((numJ - 1) / 25);

    console.log(`idx = ${idx}, jdx = ${jdx}`);
  });

  gameBoard.addEventListener("touchmove", (e) => {
    e.preventDefault();
  });

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
