export class Ancestor {
  constructor(idx, jdx, char, div, innerDiv) {
    this.idx = idx;
    this.jdx = jdx;
    this.char = char;
    this.gameTile = div;
    this.innerGameTile = innerDiv;
    this.wordCount = 0;
    this.clueCharDivs = [];
    this.active = false;
    this.visited = false;
    this.lastVisited = false;
    this.neighbors = {};
    this.path = [`${idx},${jdx}`];
    this.lines = [];
    this.complete = false;
    this.deadNode = false;
    this.root = this;
  }
}
