export class Ancestor {
  constructor(idx, jdx, char, div, innerDiv, visitID) {
    this.idx = idx;
    this.jdx = jdx;
    this.char = char;
    this.gameTile = div;
    this.innerGameTile = innerDiv;
    this.wordCount = 0;
    this.clueCharDivs = [];
    this.visitID = visitID;
    this.neighbors = {};
    this.complete = false;
    this.deadNode = false;
  }
}
