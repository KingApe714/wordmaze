import definitions from '../src/definitions.json' with { type: "json" };

console.log(definitions['TEST'])

// just build the project in one js file and then focus on how you want to organize it

class GameTile {
  constructor() {
    this.div = document.createElement('div');
    this.children = [];
  }
}