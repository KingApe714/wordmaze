export class Ancestor {
  constructor(idx, jdx, char, div, innerDiv, visitID, piece) {
    this.idx = idx;
    this.jdx = jdx;
    this.char = char;
    this.piece = piece;
    this.gameTile = div;
    this.innerGameTile = innerDiv;
    this.clueCharDivs = [];
    this.wordCount = 0;
    this.visitID = visitID;
    this.neighbors = {};
    this.complete = false;
    this.deadNode = false;
  }
}
