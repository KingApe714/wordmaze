export const gamePlay = (ancestoryMatrix) => {
  const gameBoard = document.querySelector(".inner-game-container");
  // I can grab the svg from here and handle the drawing line logic from here
  // I need to be able to key into the ancestoryMatrix with the coordinates that the touch events give me
  // From there I should be able to work out similar logic to what I did with the AncestoryNodeRoot class
  // Lets start by grabbing the node from the ancestory matrix given the coordinates of the touch events on the game board.

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
