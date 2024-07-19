import { activateRootNode, touchmove_mouseover } from "./eventHandlers.js";

class Ancestor {
  constructor(i, j, char, div) {
    this.i = i;
    this.j = j;
    this.char = char;
    this.gameDiv = div;
    this.clueDiv = null;
    this.word = null;
    this.found = false;
    this.children = new Map();
    this.neighbors = {};
    this.points = 0;
    this.timeBonus = 0;

    this.active = false;
  }
}

export class AncestoryNodeRoot extends Ancestor {
  constructor(i, j, char, div, innerDiv, ancestoryMatrix) {
    super(i, j, char, div);
    this.ancestoryMatrix = ancestoryMatrix;
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
    this.currentPath = [[i, j]];

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.gameDiv.addEventListener("mousedown", this.handleMouseDown);

    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.gameDiv.addEventListener("mouseover", this.handleMouseOver);
  }

  handleMouseDown(e) {
    e.preventDefault();
    activateRootNode(this);
  }

  handleMouseOver(e) {
    e.preventDefault();
    touchmove_mouseover(this);
  }
}

export class AncestoryNode extends Ancestor {
  constructor(i, j, char, div, root) {
    super(i, j, char, div);
    this.parent = null;
    this.path = null;
    this.definition = null;
    this.rootNode = root;
  }
}
