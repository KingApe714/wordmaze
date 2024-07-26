export class Ancestor {
  constructor(idx, jdx, char, div, innerDiv) {
    this.idx = idx;
    this.jdx = jdx;
    this.char = char;
    this.gameTile = div;
    this.innerGameTile = innerDiv;
    this.wordCount = 0;
    this.clueCharDivs = [];
    this.visited = false;
    this.neighbors = {};
    this.complete = false;
    this.deadNode = false;
  }
}
