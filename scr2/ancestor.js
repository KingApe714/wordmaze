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
  constructor(i, j, char, div) {
    super(i, j, char, div);
    this.complete = false;
    this.deadNode = false;
    this.wordCount = 0;
    this.foundWordCount = 0;
    this.clueCharContainers = [];

    this.gameDiv.addEventListener("mousedown", (e) => {
      e.preventDefault();
      this.gameDiv.style.boxShadow = "10px 10px 5px 2px rgba(0, 0, 0, 0.5)";
      this.active = true;
    });

    this.gameDiv.addEventListener("mouseover", (e) => {
      e.preventDefault();

      if (this.active) {
        this.gameDiv.style.boxShadow = "10px 10px 5px 2px rgba(0, 0, 0, 0.5)";
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
