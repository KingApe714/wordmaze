/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/game.js":
/*!*********************!*\
  !*** ./src/game.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _trie_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./trie.js */ \"./src/trie.js\");\n/* harmony import */ var _gridNode_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./gridNode.js */ \"./src/gridNode.js\");\n\n\n\nlet globalDictionary = null;\n\nasync function getDictionay() {\n    const response = await fetch('dictionary.txt');\n    const data = await response.text();\n    globalDictionary = data.split(/\\r?\\n/).filter(word => {\n        return word.length > 2\n    })\n}\n\nasync function game() {\n    await getDictionay()\n    const root = new _trie_js__WEBPACK_IMPORTED_MODULE_0__.trieNode(null);\n    for (const item of globalDictionary)\n        (0,_trie_js__WEBPACK_IMPORTED_MODULE_0__.add)(item, 0, root)\n    \n    let grid = setUpGrid()\n\n    //next lets find all possible words with the letters that are given using the trieTree\n    const gameWords = [];\n    for (let x = 0; x < grid.length; x++) {\n        for (let y = 0; y < grid[0].length; y++) {\n            console.log(`checking for ${grid[x][y][1].ch} at ${grid[x][y][1].coordinates}`)\n            findWords(grid[x][y], root.map[grid[x][y][1].ch])\n        }\n    }\n}\n    \n\nfunction findWords(cell, tree) {\n    const words = [];\n    const queue = [[tree, cell]];\n    const visitedCells = [cell];\n\n    //for ele, tree is position 0 and cell is position 1\n    //for cell tile is position 0 and node is position 1\n    while (queue.length) {\n        let ele = queue.shift();\n        for (let i = 0; i < ele[1][1].neighbors.length; i++) {\n            if (ele[0].complete) {\n                let currentWord = fetchWord(ele[0])\n                if (!words.includes(currentWord)) {\n                    words.push(currentWord)\n                }\n            }\n            if (!visitedCells.includes(ele[1][1].neighbors[i])) {\n                visitedCells.push(ele[1][1].neighbors[i])\n                //grab the char of the current neighbor\n                // console.log(`${ele[1][1].coordinates} ${ele[1][1].ch}`)\n                // console.log(ele[1][1].neighbors[i][1].ch)\n                let char = ele[1][1].neighbors[i][1].ch\n                // console.log(char)\n                let subTree = ele[0]\n                // console.log(subTree)\n                if (subTree.map[char]) {\n                    subTree = subTree.map[char];\n                    // console.log(subTree)\n                    //I just need to give it the next cell\n                    queue.push([subTree, ele[1][1].neighbors[i]])\n                }\n            }\n        }\n    }\n    console.log(cell[1].coordinates)\n    console.log(words)\n}\n\nfunction fetchWord(currentNode) {\n    let nodeCheck = currentNode;\n    let word = '';\n    while(nodeCheck.parent !== null) {\n        word = nodeCheck.ch + word;\n        nodeCheck = nodeCheck.parent;\n    }\n    \n    return word;\n}\n\n//set up gridNodes with their respective divs in an inner array length 2\nfunction setUpGrid() {\n    const grid = []\n    const gameBoardContainer = document.querySelector('.game-board-container')\n    //set up neighbor check\n    const nCheck = [\n        [-1, -1],\n        [-1, 0],\n        [-1, 1],\n        [1, -1],\n        [1, 0],\n        [1, 1],\n        [0, 1],\n        [0, -1]\n    ]\n\n    for (let i = 0; i < 4; i++) {\n        let row = []\n        for (let j = 0; j < 4; j++) {\n            let cell = []\n            let tile = document.createElement('div')\n            let letter = \"ABCDEFGHIJKLMNOPQRSTUVWXYZ\"[Math.floor(Math.random() * 26)]\n\n            tile.className = \"game-tile\"\n            tile.style.left = j * 100 + \"px\";\n            tile.style.top = i * 100 + \"px\";\n            tile.innerHTML = `${letter} [${i},${j}]`\n            gameBoardContainer.appendChild(tile)\n\n            cell.push(tile)\n            cell.push(new _gridNode_js__WEBPACK_IMPORTED_MODULE_1__.gridNode(letter, `${i},${j}`))\n            row.push(cell)\n        }\n        grid.push(row)\n    }\n\n    for (let i = 0; i < grid.length; i++) {\n        for (let j = 0; j < grid[0].length; j++) {\n\n            //set up neighbors\n            nCheck.forEach(n => {\n                let x = n[0] + i;\n                let y = n[1] + j;\n                //handle edge cases\n                if (x >= 0 && x < grid.length && y >= 0 && y < grid[0].length) {\n                    grid[i][j][1].neighbors.push(grid[x][y])\n                }\n            })\n        }\n    }\n    return grid\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (game);\n\n//# sourceURL=webpack:///./src/game.js?");

/***/ }),

/***/ "./src/gridNode.js":
/*!*************************!*\
  !*** ./src/gridNode.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"gridNode\": () => (/* binding */ gridNode)\n/* harmony export */ });\n\n\nfunction gridNode(ch, coordinates) {\n    this.ch = ch;\n    this.neighbors = [];\n    this.coordinates = coordinates;\n}\n\n//# sourceURL=webpack:///./src/gridNode.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _game_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game.js */ \"./src/game.js\");\n\n\ndocument.addEventListener(\"DOMContentLoaded\", () => {\n    (0,_game_js__WEBPACK_IMPORTED_MODULE_0__.default)()\n})\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/trie.js":
/*!*********************!*\
  !*** ./src/trie.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"trieNode\": () => (/* binding */ trieNode),\n/* harmony export */   \"add\": () => (/* binding */ add),\n/* harmony export */   \"search\": () => (/* binding */ search)\n/* harmony export */ });\nfunction trieNode(ch) {\n    this.ch = ch;\n    this.complete = false;\n    this.map = {};\n    this.parent = null;\n    this.words = [];\n}\n\nfunction add(str, i, root) {\n    if (i === str.length) {\n        root.complete = true;\n        return\n    }\n\n    if (!root.map[str[i]]) {\n        root.map[str[i]] = new trieNode(str[i])\n        root.map[str[i]].parent = root;\n    }\n\n    root.words.push(str);\n    add(str, i + 1, root.map[str[i]]);\n}\n\nfunction search(str, i, root) {\n    if (i === str.length) \n        return root.words;\n\n    if (!root.map[str[i]])\n        return [];\n    \n    return search(str, i+1, root.map[str[i]]);\n}\n\n//# sourceURL=webpack:///./src/trie.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;