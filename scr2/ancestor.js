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

    this.gameDiv.addEventListener("mousedown", (e) => {
      e.preventDefault();
      this.innerGameDiv.classList.add("active-inner-game-tile");
      this.visited = true;
      this.lastVisited = true;

      if (this.word) console.log(this.word);
    });

    this.gameDiv.addEventListener("mouseover", (e) => {
      e.preventDefault();

      const svg = document.getElementById("line-canvas");

      // gameBoard must be active, this tile must not be visited and one of the neighbors has to be lastVisited
      if (
        this.active &&
        !this.visited &&
        Object.values(this.neighbors).some((nei) => nei.lastVisited)
      ) {
        this.innerGameDiv.classList.add("active-inner-game-tile");
        this.visited = true;

        for (const key in this.neighbors) {
          const nei = this.neighbors[key];

          if (nei.lastVisited) {
            nei.lastVisited = false;

            const rect1 = this.innerGameDiv.getBoundingClientRect();
            const rect2 = nei.innerGameDiv.getBoundingClientRect();

            // Calculate the start and end points of the line
            const x1 = rect1.left + rect1.width / 2;
            const y1 = rect1.top + rect1.height / 2;
            const x2 = rect2.left + rect2.width / 2;
            const y2 = rect2.top + rect2.height / 2;

            // Create an SVG line element
            const line = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "line"
            );
            line.setAttribute("x1", x1);
            line.setAttribute("y1", y1);
            line.setAttribute("x2", x2);
            line.setAttribute("y2", y2);
            line.setAttribute("stroke", "red");
            line.setAttribute("stroke-width", "1");

            svg.appendChild(line);

            this.lines = [...nei.lines, line];

            const key = `${this.i},${this.j}`;

            for (const line of this.lines) {
              line.setAttribute("stroke", "red");
            }

            if (nei.current !== null && nei.current.children.has(key)) {
              this.current = nei.current.children.get(key);
              const rootNode = this.current.rootNode;
              const that = this;

              if (that.current.word) {
                if (!that.current.found) {
                  for (const line of this.lines) {
                    line.setAttribute("stroke", "green");
                  }
                } else {
                  // here is where I style the divs and the line to indicate to the user that they have already found this tile
                  console.log("you've found this one already");
                  console.log(that.current.path);

                  for (const line of this.lines) {
                    line.setAttribute("stroke", "yellow");
                  }
                }
              }
            } else {
              console.log("you're not spelling a word!");
              for (let i = 0; i < this.gameBoard.length; i += 1) {
                for (let j = 0; j < this.gameBoard[i].length; j += 1) {
                  const node = this.gameBoard[i][j];
                  node.current = null;
                }
              }
            }
          }
        }

        this.lastVisited = true;
      }
    });
  }
}

// have a reference from a completed word node, back to the rootNode for building the modal at the end of every stage
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
