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
  constructor(i, j, char, div, innerDiv) {
    super(i, j, char, div);
    this.innerGameDiv = innerDiv;
    this.complete = false;
    this.deadNode = false;
    this.wordCount = 0;
    this.foundWordCount = 0;
    this.clueCharContainers = [];
    this.visited = false;
    this.lastVisited = false;

    this.gameDiv.addEventListener("mousedown", (e) => {
      e.preventDefault();
      this.innerGameDiv.classList.add("active-inner-game-tile");
      this.visited = true;
      this.lastVisited = true;
    });

    this.gameDiv.addEventListener("mouseover", (e) => {
      e.preventDefault();

      const svg = document.getElementById("line-canvas");

      if (this.active && !this.visited) {
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
            line.setAttribute("stroke", "black");
            line.setAttribute("stroke-width", "2");

            svg.appendChild(line);
          }
        }

        this.lastVisited = true;
      } else if (this.active && this.visited) {
        // here I know that I've come back to a node that I've already crossed over. I need to make sure that I stop allowing for drawing a line
        // maybe I can set all the nodes active status to false. This way, although we might not have moused up, It won't recognize any new squares outside of the ones that we've found
      }
    });
  }
}

export class AncestoryNode extends Ancestor {
  constructor(i, j, char, div) {
    super(i, j, char, div);
    this.parent = null;
    this.found = false;
    this.path = null;
    this.definition = null;
  }
}
