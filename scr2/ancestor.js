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
  }
}

export class AncestoryNodeRoot extends Ancestor {
  constructor(i, j, char, div) {
    super(i, j, char, div);
    this.complete = false;
    this.deadNode = false;
    this.wordCount = 0;
    this.foundWordCount = 0;
    this.clueCharContainers = [];

    this.gameDiv.addEventListener("mousedown", (e) => {
      console.log("testing");
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
