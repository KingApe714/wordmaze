export const gamePlay = (ancestoryMatrix) => {
  const gameBoard = document.querySelector(".inner-game-container");

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

    const svg = document.getElementById("line-canvas");
    svg.innerHTML = "";

    for (let i = 0; i < 4; i += 1) {
      for (let j = 0; j < 4; j += 1) {
        const node = ancestoryMatrix[i][j];
        if (node.lastVisited && node.current) {
          const rootNode = node.current.rootNode || node;
          const current = node.current;

          if (!current.found) rootNode.foundWordCount += 1;
          current.found = true;
          current.clueDiv.style.backgroundColor = "green";

          if (rootNode.foundWordCount === rootNode.wordCount) {
            rootNode.complete = true;
            rootNode.innerGameDiv.style.backgroundColor =
              "rgba(0, 128, 0, 0.5)";
            console.log("we've completed a tile");

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
        node.innerGameDiv.classList.remove("active-inner-game-tile");
      }
    }
  });
};
