import { addSeconds } from "./timer.js";

export const activateRootNode = (node, paths, user, ancestoryMatrix) => {
  const coords = `${node.idx},${node.jdx}`;
  user.firstVisitedTile = coords;
  user.lastVisitedTile = coords;
  user.visited *= node.visitID;
  user.path.push(coords);

  // highlighting logic for single letter words
  highlightPath(user, paths, ancestoryMatrix);
};

export const touchmove_mousemove = (node, paths, user, ancestoryMatrix) => {
  const visited = user.visited % node.visitID === 0n;
  const key = user.lastVisitedTile;

  if (user.activeBoard && !visited && key in node.neighbors) {
    const coords = `${node.idx},${node.jdx}`;
    user.path.push(coords);

    const nei = node.neighbors[key];
    const line = drawLine(node.innerGameTile, nei.innerGameTile);
    user.lines.push(line);
    highlightPath(user, paths, ancestoryMatrix);

    user.lastVisitedTile = coords;
    user.visited *= node.visitID;
  }
};

const highlightPath = (user, paths, ancestoryMatrix) => {
  const key = user.path.join("-");
  if (paths.has(key)) {
    if (!paths.get(key).found) {
      updateLine(user, "rgba(0, 128, 0, 0.5)", ancestoryMatrix);
    } else {
      updateLine(user, "rgba(255, 255, 0, 0.4)", ancestoryMatrix);
    }
  } else {
    updateLine(user, "rgba(255, 0, 0, 0.4)", ancestoryMatrix);
  }
};

// I'm wondering if there is a way to update this line without the loop
const updateLine = (user, color, ancestoryMatrix) => {
  const path = user.path;
  const lines = user.lines;

  for (let i = 0; i < path.length; i += 1) {
    const [idx, jdx] = path[i].split(",");
    const innerGameTile = ancestoryMatrix[idx][jdx].innerGameTile;
    innerGameTile.style.backgroundColor = color;

    if (lines[i]) {
      const line = lines[i];
      line.setAttribute("stroke", color);
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
  line.setAttribute("stroke", "rgba(255, 0, 0, 0.4)");
  line.setAttribute("stroke-width", "2");

  svg.appendChild(line);

  return line;
};

export const touchend_mouseup = (ancestoryMatrix, user, paths, points) => {
  const svg = document.getElementById("line-canvas");
  svg.innerHTML = "";

  const key = user.path.join("-");

  if (paths.has(key)) {
    // here I know that I've found a word
    const obj = paths.get(key);
    if (!obj.found) {
      // here I know that this is a word that hasn't been found before
      addSeconds(user.path.length);
      awardPoints(obj, user, points, ancestoryMatrix);
      handleRootNode(user, ancestoryMatrix);
    } else {
      // here I know that this word has been found before
      user.demerits.foundWords.push(user.path.slice());
    }
  } else {
    // here I know that I am looking at a nonword
    user.demerits.nonwords.push(user.path.slice());
  }

  // from here I need to deactivate the nodes
  deactivateBoard(user, ancestoryMatrix);
};

// here is where I need to manipulate the content of the clueDiv
const awardPoints = (obj, user, points, ancestoryMatrix) => {
  const pointsCounter = document.querySelector(".points-counter");
  obj.found = true;

  const charDivs = obj.wordContainer.childNodes;
  const word = obj.word;

  for (let i = 0; i < word.length; i += 1) {
    const char = word[i];
    const div = charDivs[i];
    div.innerHTML = char;
  }

  const pointsKey = user.path.length;
  const p = points[pointsKey];
  user.points += p;
  pointsCounter.innerHTML = user.points;
};

const handleRootNode = (user, ancestoryMatrix) => {
  const [idx, jdx] = user.firstVisitedTile.split(",");
  const root = ancestoryMatrix[idx][jdx];
  root.wordCount -= 1;

  if (root.wordCount === 0) {
    // here I know that this tile has been completed
    root.complete = true;
    root.innerGameTile.classList.add("found-inner-game-tile");
    for (const div of root.clueCharDivs) {
      div.style.backgroundImage = window.getComputedStyle(
        root.gameTile
      ).backgroundImage;
      div.innerText = root.char;
    }
  }
};

const deactivateBoard = (user, ancestoryMatrix) => {
  for (const coords of user.path) {
    const [idx, jdx] = coords.split(",");
    const node = ancestoryMatrix[idx][jdx];
    node.innerGameTile.style.backgroundColor = "";
  }

  user.activeBoard = false;
  user.lastVisitedTile = null;
  user.firstVisitedTile = null;
  user.visited = 1n;
  user.lines.length = 0;
  user.path.length = 0;
};

export const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};
