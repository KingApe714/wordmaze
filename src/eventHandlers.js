import { addSeconds } from "./timer.js";

export const activateMatrix = (ancestoryMatrix) => {
  for (let i = 0; i < 4; i += 1) {
    for (let j = 0; j < 4; j += 1) {
      const node = ancestoryMatrix[i][j];
      node.active = true;
    }
  }
};

export const activateRootNode = (node, paths) => {
  node.innerGameTile.style.backgroundColor = "rgba(255, 0, 0, 0.4)";
  node.visited = true;
  node.lastVisited = true;

  // highlighting logic for single letter words
  highlightPath(node, paths);
};

export const touchmove_mousemove = (node, paths) => {
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

        node.root = nei.root;
        node.path = [...nei.path, `${node.idx},${node.jdx}`];

        const line = drawLine(node.innerGameTile, nei.innerGameTile);
        node.lines = [...nei.lines, line];
        updateLine(node, "rgba(255, 0, 0, 0.4)");
        highlightPath(node, paths);
      }
    }

    node.lastVisited = true;
  }
};

const highlightPath = (node, paths) => {
  const key = node.path.join("-");
  if (paths.has(key)) {
    if (!paths.get(key).found) {
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

  const len = node.path.length;
  const path = node.path.slice(0, len - 1).reverse();
  let current = node;

  for (const coord of path) {
    current.innerGameTile.style.backgroundColor = color;
    current = current.neighbors[coord];
  }

  current.innerGameTile.style.backgroundColor = color;
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

export const touchend_mouseup = (ancestoryMatrix, user, paths, points) => {
  const pointsCounter = document.querySelector(".points-counter");
  const svg = document.getElementById("line-canvas");
  svg.innerHTML = "";

  for (let i = 0; i < 4; i += 1) {
    for (let j = 0; j < 4; j += 1) {
      const node = ancestoryMatrix[i][j];

      if (node.lastVisited) {
        const key = node.path.join("-");

        if (paths.has(key)) {
          // here I know that I've found a word
          const obj = paths.get(key);
          if (!obj.found) {
            // here I know that this is a word that hasn't been found before
            addSeconds(node.path.length);
            obj.found = true;
            obj.clueWord.style.backgroundColor = "green";

            const pointsKey = node.path.length;
            const p = points[pointsKey];
            user.points += p;
            pointsCounter.innerHTML = user.points;

            const root = node.root;
            root.wordCount -= 1;

            if (root.wordCount === 0) {
              // here I know that this tile has been completed
              root.complete = true;
              root.innerGameTile.classList.add("found-inner-game-tile");

              for (const div of root.clueCharDivs) {
                div.style.backgroundColor = "green";
                div.innerHTML = root.char;
              }
            }
          } else {
            // here I know that this word has been found before
            user.demerits.foundWords.push(node.path);
          }
        } else {
          // here I know that I am looking at a nonword
          user.demerits.nonwords.push(node.path);
        }
      }

      node.active = false;
      node.visited = false;
      node.lastVisited = false;
      node.lines.length = 0;
      node.innerGameTile.style.backgroundColor = "";
      node.path = [`${node.idx},${node.jdx}`];
      node.root = node;
    }
  }
};

export const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};
