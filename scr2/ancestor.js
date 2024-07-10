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

    // if I mouse over, then one of my neighbors must have been the last ones visited. I need to find the last one that was visited and draw a line between that one and the current one
    this.gameDiv.addEventListener("mouseover", (e) => {
      e.preventDefault();

      if (this.active && !this.visited) {
        this.innerGameDiv.classList.add("active-inner-game-tile");
        this.visited = true;

        // console.log(this.i, this.j);
        // I need to loop through the neighbors to see who the lastVisited was, draw a line between that node and this one, and then set that last node's .lastVisited to false and set this node.lastVisited to true

        for (const key in this.neighbors) {
          const nei = this.neighbors[key];
          // console.log(nei);

          if (nei.lastVisited) {
            nei.lastVisited = false;
            console.log(
              `there should be a line between ${[nei.i, nei.j]} and ${[
                this.i,
                this.j,
              ]}`
            );
          }
        }

        this.lastVisited = true;
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
