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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _trie_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./trie.js */ \"./src/trie.js\");\n/* harmony import */ var _gridNode_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./gridNode.js */ \"./src/gridNode.js\");\n/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util.js */ \"./src/util.js\");\n\n\n\n\nlet globalDictionary = null;\n\nasync function getDictionay() {\n    const response = await fetch('dictionary.txt');\n    const data = await response.text();\n    globalDictionary = data.split(/\\r?\\n/).filter(word => {\n        return word.length > 2\n    })\n}\n\nasync function game() {\n    await getDictionay()\n    const root = new _trie_js__WEBPACK_IMPORTED_MODULE_0__.trieNode(null);\n    for (const item of globalDictionary)\n        (0,_trie_js__WEBPACK_IMPORTED_MODULE_0__.add)(item, 0, root)\n    \n    ;(0,_util_js__WEBPACK_IMPORTED_MODULE_2__.modal)()\n    ;(0,_util_js__WEBPACK_IMPORTED_MODULE_2__.timer)()\n    let grid = (0,_gridNode_js__WEBPACK_IMPORTED_MODULE_1__.setUpGrid)()\n\n    //next lets find all possible words with the letters that are given using the trieTree\n    const gameWords = [];\n    for (let x = 0; x < grid.length; x++) {\n        for (let y = 0; y < grid[0].length; y++) {\n            console.log(`checking for ${grid[x][y].ch} at ${grid[x][y].coordinates}`)\n            ;(0,_gridNode_js__WEBPACK_IMPORTED_MODULE_1__.findWords)(grid[x][y], root.map[grid[x][y].ch]).forEach(word => {\n                if (!gameWords.includes(word)) {\n                    gameWords.push(word)\n                }\n            })\n        }\n    }\n\n    console.log(gameWords)\n    // console.log(\"checking for [0][0]\")\n    // findWords(grid[0][0], root.map[grid[0][0].ch])\n}\n    \n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (game);\n\n//# sourceURL=webpack:///./src/game.js?");

/***/ }),

/***/ "./src/gridNode.js":
/*!*************************!*\
  !*** ./src/gridNode.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"gridNode\": () => (/* binding */ gridNode),\n/* harmony export */   \"setUpGrid\": () => (/* binding */ setUpGrid),\n/* harmony export */   \"findWords\": () => (/* binding */ findWords)\n/* harmony export */ });\n/* harmony import */ var _trie__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./trie */ \"./src/trie.js\");\n\n\nfunction gridNode(coordinates) {\n    this.neighbors = [];\n    this.coordinates = coordinates;\n    this.ancestory = {\n        node: this,\n        complete: false,\n        children: {}\n    };\n\n    this.tile = document.createElement('div')\n    this.tile.className = \"game-tile\";\n    let letter = \"AABCDEEFGHIIJKLMNOOPQRSSTUUVWXYZ\"[Math.floor(Math.random() * 32)]\n    this.ch = letter;\n\n    this.innerTile = document.createElement('div')\n    this.innerTile.className = \"inner-game-tile\"\n    this.innerTile.innerHTML = `${letter} [${coordinates}]`;\n    this.tile.appendChild(this.innerTile)\n\n    this.selected = false;\n}\n\nfunction setUpGrid() {\n    const grid = []\n    const gameBoardContainer = document.querySelector('.game-board-container')\n    //set up neighbor check\n    const nCheck = [\n        [-1, 1],\n        [0, 1],\n        [1, 1],\n        [1, 0],\n        [1, -1],\n        [0, -1],\n        [-1, -1],\n        [-1, 0]\n    ]\n\n    let mouseDown = false;\n    let word = \"\"\n    gameBoardContainer.addEventListener(\"mousedown\", () => {\n        mouseDown = true;\n        console.log(\"mouse is down\")\n    })\n\n    gameBoardContainer.addEventListener(\"mouseup\", () => {\n\n        word = \"\"\n\n        for (let i = 0; i < grid.length; i++) {\n            for (let j = 0; j < grid[0].length; j++) {\n                let gNode = grid[i][j];\n                gNode.tile.style.backgroundColor = \"white\";\n                gNode.selected = false\n            }\n        }\n    })\n\n    for (let i = 0; i < 4; i++) {\n        let row = []\n        for (let j = 0; j < 4; j++) {\n            let gNode = new gridNode(`${i},${j}`)\n            gNode.tile.style.left = j * 100 + \"px\";\n            gNode.tile.style.top = i * 100 + \"px\";\n\n            //when I mousedown then I'm using this as my first tile\n            gNode.innerTile.addEventListener(\"mousedown\", () => {\n                mouseDown = true;\n                if (!gNode.selected) {\n                    word = gNode.ch\n                    gNode.tile.style.backgroundColor = \"blue\";\n                }\n                gNode.selected = true;\n            })\n\n            //when I mousemove I am building potential words\n            gNode.innerTile.addEventListener(\"mousemove\", () => {\n                if (mouseDown) {\n                    if (!gNode.selected) {\n                        word += gNode.ch\n                        gNode.tile.style.backgroundColor = \"blue\";\n                    }\n                    gNode.selected = true\n                    console.log(word)\n                }\n            })\n\n            gNode.innerTile.addEventListener(\"mouseup\", () => {\n                mouseDown = false;\n                gNode.selected = false;\n            })\n\n            gameBoardContainer.appendChild(gNode.tile)\n            row.push(gNode)\n        }\n        grid.push(row)\n    }\n\n    //for testing\n    // grid[0][0].ch = \"C\"\n    // grid[0][0].tile.innerHTML = `C [${grid[0][0].coordinates}]`\n\n    // grid[0][1].ch = \"E\"\n    // grid[0][1].tile.innerHTML = `E [${grid[0][1].coordinates}]`\n\n    // grid[0][2].ch = \"L\"\n    // grid[0][2].tile.innerHTML = `L [${grid[0][2].coordinates}]`\n\n    // grid[0][3].ch = \"Z\"\n    // grid[0][3].tile.innerHTML = `Z [${grid[0][3].coordinates}]`\n\n    // grid[1][0].ch = \"W\"\n    // grid[1][0].tile.innerHTML = `W [${grid[1][0].coordinates}]`\n\n    // grid[1][1].ch = \"R\"\n    // grid[1][1].tile.innerHTML = `R [${grid[1][1].coordinates}]`\n\n    // grid[1][2].ch = \"I\"\n    // grid[1][2].tile.innerHTML = `I [${grid[1][2].coordinates}]`\n\n    // grid[1][3].ch = \"Y\"\n    // grid[1][3].tile.innerHTML = `Y [${grid[1][3].coordinates}]`\n\n    // grid[2][0].ch = \"L\"\n    // grid[2][0].tile.innerHTML = `L [${grid[2][0].coordinates}]`\n\n    // grid[2][1].ch = \"M\"\n    // grid[2][1].tile.innerHTML = `M [${grid[2][1].coordinates}]`\n\n    // grid[2][2].ch = \"R\"\n    // grid[2][2].tile.innerHTML = `R [${grid[2][2].coordinates}]`\n\n    // grid[2][3].ch = \"P\"\n    // grid[2][3].tile.innerHTML = `P [${grid[2][3].coordinates}]`\n\n    // grid[3][0].ch = \"F\"\n    // grid[3][0].tile.innerHTML = `F [${grid[3][0].coordinates}]`\n\n    // grid[3][1].ch = \"Y\"\n    // grid[3][1].tile.innerHTML = `Y [${grid[3][1].coordinates}]`\n\n    // grid[3][2].ch = \"M\"\n    // grid[3][2].tile.innerHTML = `M [${grid[3][2].coordinates}]`\n\n    // grid[3][3].ch = \"S\"\n    // grid[3][3].tile.innerHTML = `S [${grid[3][3].coordinates}]`\n\n    for (let i = 0; i < grid.length; i++) {\n        for (let j = 0; j < grid[0].length; j++) {\n\n            //set up neighbors\n            nCheck.forEach(n => {\n                let x = n[0] + i;\n                let y = n[1] + j;\n                //handle edge cases\n                if (x >= 0 && x < grid.length && y >= 0 && y < grid[0].length) {\n                    grid[i][j].neighbors.push(grid[x][y])\n                }\n            })\n        }\n    }\n    return grid\n}\n\nfunction findWords(gridNode, tree) {\n    //gridNode could be my Adam\n    const words = [];\n    //pos 2 of all queued is the path from original gridNode to currentNode\n    //use pos 2 to key into ancestory to set up next nodes\n    const queue = [[tree, gridNode, [gridNode]]];\n\n    while (queue.length) {\n        let ele = queue.shift();\n        if (ele[0].complete) {\n            let currentWord = (0,_trie__WEBPACK_IMPORTED_MODULE_0__.fetchWord)(ele[0])\n            if (!words.includes(currentWord)) {\n                words.push(currentWord)\n            }\n        }\n        let visitedNodes = ele[2].slice()\n        for (let i = 0; i < ele[1].neighbors.length; i++) {\n            if (!visitedNodes.includes(ele[1].neighbors[i]) &&\n                !ele[2].includes(ele[1].neighbors[i])) {\n\n                let path = ele[2].slice()\n                path.push(ele[1].neighbors[i])\n                visitedNodes.push(ele[1].neighbors[i])\n\n                let char = ele[1].neighbors[i].ch\n                let subTree = ele[0]\n                if (subTree.map[char]) {\n                    subTree = subTree.map[char];\n                    \n                    let currentNode = gridNode.ancestory\n                    //key into ancestory until at the right position\n                    for (let x = 1; x < ele[2].length; x++) {\n                        if (currentNode.children[ele[2][x].coordinates]) {\n                            currentNode = currentNode.children[ele[2][x].coordinates]\n                        }\n                    }\n                    currentNode.children[ele[1].neighbors[i].coordinates] = {\n                        node: ele[1].neighbors[i],\n                        complete: subTree.complete,\n                        children: {}\n                    }\n\n                    queue.push([subTree, ele[1].neighbors[i], path])\n                }\n            }\n        }\n    }\n    console.log(words)\n    console.log(gridNode.ancestory)\n    return words\n}\n\n//# sourceURL=webpack:///./src/gridNode.js?");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"trieNode\": () => (/* binding */ trieNode),\n/* harmony export */   \"add\": () => (/* binding */ add),\n/* harmony export */   \"search\": () => (/* binding */ search),\n/* harmony export */   \"fetchWord\": () => (/* binding */ fetchWord)\n/* harmony export */ });\nfunction trieNode(ch) {\n    this.ch = ch;\n    this.complete = false;\n    this.map = {};\n    this.parent = null;\n    this.words = [];\n}\n\nfunction add(str, i, root) {\n    if (i === str.length) {\n        root.complete = true;\n        return\n    }\n\n    if (!root.map[str[i]]) {\n        root.map[str[i]] = new trieNode(str[i])\n        root.map[str[i]].parent = root;\n    }\n\n    root.words.push(str);\n    add(str, i + 1, root.map[str[i]]);\n}\n\nfunction search(str, i, root) {\n    if (i === str.length) \n        return root.words;\n\n    if (!root.map[str[i]])\n        return [];\n    \n    return search(str, i+1, root.map[str[i]]);\n}\n\nfunction fetchWord(currentNode) {\n    let nodeCheck = currentNode;\n    let word = '';\n    while(nodeCheck.parent !== null) {\n        word = nodeCheck.ch + word;\n        nodeCheck = nodeCheck.parent;\n    }\n    \n    return word;\n}\n\n//# sourceURL=webpack:///./src/trie.js?");

/***/ }),

/***/ "./src/util.js":
/*!*********************!*\
  !*** ./src/util.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"modal\": () => (/* binding */ modal),\n/* harmony export */   \"timer\": () => (/* binding */ timer)\n/* harmony export */ });\n\nfunction modal() {\n    const modalBtn = document.querySelector('.modal-button');\n    const modalBg = document.querySelector('.modal-bg');\n    const modalClose = document.querySelector('.modal-close');\n    const modalChild = document.querySelector('.modal-child');\n\n    modalBtn.addEventListener('click', function() {\n        modalBg.classList.add('bg-active')\n        modalChild.innerHTML = \"TESTING\"\n    })\n\n    modalClose.addEventListener('click', function() {\n        modalBg.classList.remove('bg-active');\n    })\n}\n\nfunction timer() {\n    let time = 120;\n    const countdownEl = document.querySelector('.countdown');\n    let t = setInterval(updateCountdown, 1000);\n\n    function updateCountdown() {\n        const minutes = Math.floor(time / 60)\n        let seconds = time % 60;\n\n        seconds = seconds < 10 ? '0' + seconds : seconds;\n\n        countdownEl.innerHTML = `${minutes}:${seconds}`\n\n        if (time > 0) time--;\n    }\n}\n\n//# sourceURL=webpack:///./src/util.js?");

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