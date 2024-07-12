class Ancestor {
  constructor(i, j, char, div) {
    this.i = i;
    this.j = j;
    this.char = char;
    this.gameDiv = div;
    this.clueDiv = null;
    this.word = null;
    this.children = new Map();
    this.neighbors = {};

    this.active = false;
  }
}

export class AncestoryNodeRoot extends Ancestor {
  constructor(i, j, char, div, innerDiv, gameBoard) {
    super(i, j, char, div);
    this.gameBoard = gameBoard;
    this.innerGameDiv = innerDiv;
    this.complete = false;
    this.deadNode = false;
    this.wordCount = 0;
    this.foundWordCount = 0;
    this.clueCharContainers = [];
    this.visited = false;
    this.lastVisited = false;
    this.current = this; // this represents the ancestoryNode we are currently at
    this.lines = [];

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.gameDiv.addEventListener("mousedown", this.handleMouseDown);

    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.gameDiv.addEventListener("mouseover", this.handleMouseOver);
  }

  handleMouseDown(e) {
    e.preventDefault();
    this.innerGameDiv.classList.add("active-inner-game-tile");
    this.visited = true;
    this.lastVisited = true;
  }

  handleMouseOver(e) {
    e.preventDefault();
    if (
      this.active &&
      !this.visited &&
      Object.values(this.neighbors).some((nei) => nei.lastVisited)
    ) {
      this.innerGameDiv.classList.add("active-inner-game-tile");
      this.visited = true;

      // loop to find the last visited neighbor
      for (const key in this.neighbors) {
        const nei = this.neighbors[key];

        if (nei.lastVisited) {
          nei.lastVisited = false;

          const line = this.drawLine(this.innerGameDiv, nei.innerGameDiv);
          this.lines = [...nei.lines, line];
          this.updateLine("red");

          const key = `${this.i},${this.j}`;

          if (nei.current !== null && nei.current.children.has(key)) {
            // here I know that I've moved into a tile that is a child of the last
            this.current = nei.current.children.get(key);

            if (this.current.word) {
              //this tile completes a word
              if (!this.current.found) {
                // check to see if it's found
                this.updateLine("green");
              } else {
                // hovering over a found word
                this.updateLine("yellow");
              }
            }
          } else {
            // here I know that user is not spelling a word
            this.nullifyVisitedNodes();
          }
        }
      }

      this.lastVisited = true;
    }
  }

  nullifyVisitedNodes() {
    for (let i = 0; i < this.gameBoard.length; i += 1) {
      for (let j = 0; j < this.gameBoard[i].length; j += 1) {
        const node = this.gameBoard[i][j];
        node.current = null;
      }
    }
  }

  updateLine(color) {
    for (const line of this.lines) {
      line.setAttribute("stroke", color);
    }
  }

  drawLine(div1, div2) {
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
    line.setAttribute("stroke-width", "1");

    svg.appendChild(line);

    return line;
  }
}

export class AncestoryNode extends Ancestor {
  constructor(i, j, char, div, root) {
    super(i, j, char, div);
    this.parent = null;
    this.found = false;
    this.path = null;
    this.definition = null;
    this.rootNode = root;
  }
}
