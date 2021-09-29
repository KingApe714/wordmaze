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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _trie_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./trie.js */ \"./src/trie.js\");\n/* harmony import */ var _gridNode_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./gridNode.js */ \"./src/gridNode.js\");\n/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util.js */ \"./src/util.js\");\n\n\n\n\nlet globalDictionary = null;\n\nasync function getDictionay() {\n    const response = await fetch('dictionary.txt');\n    const data = await response.text();\n    globalDictionary = data.split(/\\r?\\n/).filter(word => {\n        return word.length > 2\n    })\n}\n\nasync function game() {\n    await getDictionay()\n    const root = new _trie_js__WEBPACK_IMPORTED_MODULE_0__.trieNode(null);\n    for (const item of globalDictionary)\n        (0,_trie_js__WEBPACK_IMPORTED_MODULE_0__.add)(item, 0, root)\n    \n    ;(0,_util_js__WEBPACK_IMPORTED_MODULE_2__.modal)()\n    ;(0,_util_js__WEBPACK_IMPORTED_MODULE_2__.timer)()\n\n    const body = document.body;\n\n    let grid = (0,_gridNode_js__WEBPACK_IMPORTED_MODULE_1__.setUpGrid)(root)\n    let miniGrid = []\n    grid.forEach(row => {\n        let miniRow = []\n        row.forEach(ancNode => {\n            let miniTile = document.createElement('div')\n            miniTile.className = \"mini-tile\";\n            miniTile.innerHTML = ancNode.node.ch\n\n            miniRow.push(miniTile)\n        })\n        miniGrid.push(miniRow)\n    })\n\n    let miniBoard = document.createElement('div')\n    miniBoard.className = \"mini-board\";\n    for (let i = 0; i < miniGrid.length; i++) {\n        for (let j = 0; j < miniGrid[0].length; j++) {\n            miniGrid[i][j].style.left = j * 30 + \"px\";\n            miniGrid[i][j].style.top = i * 30 + \"px\";\n            miniBoard.append(miniGrid[i][j])\n        }\n    }\n\n    body.append(miniBoard)\n\n\n    console.log(grid)\n    //grab each root ancestory node and return the mini paths with all words\n    for (let i = 0; i < grid.length; i++) {\n        for (let j = 0; j < grid[0].length; j++) {\n            let rootNode = grid[i][j]\n            wordPaths(rootNode)\n        }\n    }\n}\n    \n//this function should return the array of mini divs that show the paths\nfunction wordPaths(rootNode) {\n    //create the mini game board to then draw the line over it to show the path\n\n    console.log(rootNode)\n    //I need to DFS through the rootNode tree to find all words\n    let stack = [rootNode];\n    // while (stack.length) {\n\n    // }\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (game);\n\n//# sourceURL=webpack:///./src/game.js?");

/***/ }),

/***/ "./src/gridNode.js":
/*!*************************!*\
  !*** ./src/gridNode.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"gridNode\": () => (/* binding */ gridNode),\n/* harmony export */   \"ancestoryNode\": () => (/* binding */ ancestoryNode),\n/* harmony export */   \"setUpGrid\": () => (/* binding */ setUpGrid),\n/* harmony export */   \"setUpTiles\": () => (/* binding */ setUpTiles),\n/* harmony export */   \"findWords\": () => (/* binding */ findWords)\n/* harmony export */ });\n/* harmony import */ var _trie__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./trie */ \"./src/trie.js\");\n/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util */ \"./src/util.js\");\n\n\n\n//lets try unnesting the ancestoryNode from inside of this node\nfunction gridNode(coordinates) {\n    this.neighbors = [];\n    this.coordinates = coordinates;\n    // this.ancestory = new ancestoryNode(this);\n\n    this.tile = document.createElement('div')\n    this.tile.className = \"game-tile\";\n    let letter = \"AABCDEEFGHIIJKLMNOOPQRSSTUUVWXYZ\"[Math.floor(Math.random() * 32)]\n    this.ch = letter;\n\n    this.innerTile = document.createElement('div')\n    this.innerTile.className = \"inner-game-tile\"\n    this.innerTile.innerHTML = `${letter} [${coordinates}]`;\n    this.tile.appendChild(this.innerTile)\n\n    this.selected = false;\n}\n\nfunction ancestoryNode(node) {\n    this.node = node;\n    this.complete = false;\n    this.children = {};\n    this.parent = null;\n}\n\nfunction setUpGrid(root) {\n    const grid = []\n    //set up neighbor check\n    const nCheck = [\n        [-1, 1],\n        [0, 1],\n        [1, 1],\n        [1, 0],\n        [1, -1],\n        [0, -1],\n        [-1, -1],\n        [-1, 0]\n    ]\n\n    //set up gridNodes for gameBoard\n    for (let i = 0; i < 4; i++) {\n        let row = []\n        for (let j = 0; j < 4; j++) {\n            let gNode = new gridNode(`${j},${i}`)\n            gNode.tile.style.left = j * 100 + \"px\";\n            gNode.tile.style.top = i * 100 + \"px\";\n            row.push(gNode)\n        }\n        grid.push(row)\n    }\n\n    //set up gridNode neighbors\n    for (let i = 0; i < grid.length; i++) {\n        for (let j = 0; j < grid[0].length; j++) {\n\n            //set up neighbors\n            nCheck.forEach(n => {\n                let x = n[0] + i;\n                let y = n[1] + j;\n                //handle edge cases\n                if (x >= 0 && x < grid.length && y >= 0 && y < grid[0].length) {\n                    grid[i][j].neighbors.push(grid[x][y])\n                }\n            })\n        }\n    }\n\n    const gameWords = []\n\n    const newGrid = []\n\n    for (let x = 0; x < grid.length; x++) {\n        let row = [];\n        for (let y = 0; y < grid[0].length; y++) {\n            let arr = findWords(grid[x][y], root.map[grid[x][y].ch])\n            row.push(arr[1])\n            arr[0].forEach(word => {\n                if (!gameWords.includes(word)) {\n                    gameWords.push(word)\n                }\n            })\n        }\n        newGrid.push(row)\n    }\n    console.log(gameWords)\n    \n    return setUpTiles(newGrid, gameWords)\n}\n\nfunction setUpTiles(grid, gameWords) {\n    //this grid is a grid full of ancestory nodes\n    const gameBoardContainer = document.querySelector('.game-board-container')\n    const svgContainer = document.querySelector('.svg-container')\n    let mouseDown = false;\n    let word = \"\"\n    let selectedNodes = [];\n    let nodeAdam = null;\n\n    let foundWords = []\n    \n    gameBoardContainer.addEventListener(\"mousedown\", () => {\n        mouseDown = true;\n        return false;\n    })\n    \n    gameBoardContainer.addEventListener(\"mouseup\", () => {\n\n        if (gameWords.includes(word) && !foundWords.includes(word)) {\n            (0,_util__WEBPACK_IMPORTED_MODULE_1__.gamePoints)(word)\n            foundWords.push(word)\n        }\n        \n        word = \"\";\n        selectedNodes = [];\n        nodeAdam = null;\n    \n        for (let i = 0; i < grid.length; i++) {\n            for (let j = 0; j < grid[0].length; j++) {\n                let gNode = grid[i][j].node;\n                gNode.tile.style.backgroundColor = \"white\";\n                gNode.selected = false\n            }\n        }\n\n        while (svgContainer.firstChild) {\n            svgContainer.removeChild(svgContainer.firstChild)\n        }\n\n        console.log(gameBoardContainer)\n    })\n    for (let i = 0; i < 4; i++) {\n        for (let j = 0; j < 4; j++) {\n            let gNode = grid[i][j].node\n\n            //when I mousedown then I'm using this as my first tile\n            gNode.innerTile.addEventListener(\"mousedown\", () => {\n                mouseDown = true;\n                if (!gNode.selected) {\n                    word += gNode.ch\n                    selectedNodes.push(gNode)\n                    gNode.tile.style.backgroundColor = \"blue\";\n\n                    nodeAdam = grid[i][j]\n                }\n                gNode.selected = true;\n            })\n\n            //when I mousemove I am building potential words\n            gNode.innerTile.addEventListener(\"mousemove\", () => {\n                let lastNode\n                if (mouseDown) {\n                    //I know that I'm mousing over the node...\n                    if (!gNode.selected) {\n                        let newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');\n                        let [x1, y1] = selectedNodes[selectedNodes.length -1].coordinates.split(',')\n                        let [x2, y2] = gNode.coordinates.split(',')\n                        console.log(`x1 = ${x1 * 100} y1 = ${y1 * 100} x2 = ${x2 * 100} y2 = ${y2 * 100}`)\n                        newLine.setAttribute('class', 'game-line')\n                        newLine.setAttribute('x1', `${x1 * 100 + 50}`)\n                        newLine.setAttribute('y1', `${y1 * 100 + 50}`)\n                        newLine.setAttribute('x2', `${x2 * 100 + 50}`)\n                        newLine.setAttribute('y2', `${y2 * 100 + 50}`)\n                        svgContainer.appendChild(newLine)\n                        console.log(svgContainer)\n\n                        word += gNode.ch;\n                        selectedNodes.push(gNode)\n                        gNode.tile.style.backgroundColor = \"blue\"\n                        \n                        if (nodeAdam && nodeAdam.children[gNode.coordinates]\n                            && nodeAdam.node === selectedNodes[selectedNodes.length - 2]) {\n                            nodeAdam = nodeAdam.children[gNode.coordinates]\n                        }\n                        \n                        lastNode = selectedNodes[selectedNodes.length - 1];\n                    } else {\n                        if (selectedNodes.includes(gNode)) {\n                            let currentNode\n                            for (let i = selectedNodes.length - 1; i >= 0; i--) {\n                                currentNode = selectedNodes[i];\n                                if (currentNode === gNode) {\n                                    break\n                                } else {\n                                    currentNode.tile.style.backgroundColor = \"white\";\n                                    currentNode.selected = false\n                                    word = word.slice(0, word.length - 1)\n                                    selectedNodes.pop();\n                                }\n                            }\n                            if (nodeAdam.parent && currentNode === nodeAdam.parent.node) {\n                                nodeAdam = nodeAdam.parent\n                            }\n                            lastNode = selectedNodes[selectedNodes.length - 1];\n                        }\n                    }\n                    //there will always be one more selectedNode than there is lines\n                    //therefore I just need to delete all the lines past selectedNodes.length - 2\n                    let x = selectedNodes.length - 1\n                    let dif = svgContainer.children.length - x\n                    for (let i = 0; i < dif; i++) {\n                        // console.log(svgContainer.children[i])\n                        // debugger\n                        if (svgContainer.lastChild) svgContainer.removeChild(svgContainer.lastChild)\n                    }\n                    for (let i = 0; i < selectedNodes.length; i++) {\n                        let node1 = selectedNodes[i]\n                        //now check to see if I have a complete word or not\n                        if (lastNode === nodeAdam.node && nodeAdam.complete) {\n                            node1.tile.style.backgroundColor = \"yellow\"\n                        } else {\n                            node1.tile.style.backgroundColor = \"blue\"\n                        }\n                    }\n                    gNode.selected = true\n                    console.log(word)\n                }\n            })\n            \n            gNode.innerTile.addEventListener(\"mouseup\", () => {\n                mouseDown = false;\n                gNode.selected = false;\n            })\n            gameBoardContainer.appendChild(gNode.tile)\n        }\n    }\n\n    return grid\n}\n\nfunction findWords(gridNode, tree) {\n    //gridNode could be my Adam\n    const words = [];\n    //pos 2 of all queued is the path from original gridNode to currentNode\n    //use pos 2 to key into ancestory to set up next nodes\n    let rootAncNode = new ancestoryNode(gridNode);\n    const queue = [[tree, rootAncNode, [gridNode]]];\n\n    while (queue.length) {\n        let ele = queue.shift();\n        if (ele[0].complete) {\n            let currentWord = (0,_trie__WEBPACK_IMPORTED_MODULE_0__.fetchWord)(ele[0])\n            if (!words.includes(currentWord)) {\n                words.push(currentWord)\n            }\n        }\n        let visitedNodes = ele[2].slice()\n        for (let i = 0; i < ele[1].node.neighbors.length; i++) {\n            if (!visitedNodes.includes(ele[1].node.neighbors[i]) &&\n                !ele[2].includes(ele[1].node.neighbors[i])) {\n\n                let path = ele[2].slice()\n                path.push(ele[1].node.neighbors[i])\n                visitedNodes.push(ele[1].node.neighbors[i])\n\n                let char = ele[1].node.neighbors[i].ch\n                let subTree = ele[0]\n                if (subTree.map[char]) {\n                    subTree = subTree.map[char];\n                    \n                    let currentNode = rootAncNode\n                    //key into ancestory until at the right position\n                    for (let x = 0; x < ele[2].length; x++) {\n                        if (currentNode.children[ele[2][x].coordinates]) {\n                            currentNode = currentNode.children[ele[2][x].coordinates]\n                        }\n                    }\n\n                    currentNode.children[ele[1].node.neighbors[i].coordinates] = new ancestoryNode(ele[1].node.neighbors[i])\n                    let newAncNode = currentNode.children[ele[1].node.neighbors[i].coordinates]\n                    newAncNode.complete = subTree.complete\n                    newAncNode.parent = ele[1]\n\n                    queue.push([subTree, newAncNode, path])\n                }\n            }\n        }\n    }\n    return [words, rootAncNode]\n}\n\n//# sourceURL=webpack:///./src/gridNode.js?");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"modal\": () => (/* binding */ modal),\n/* harmony export */   \"timer\": () => (/* binding */ timer),\n/* harmony export */   \"gamePoints\": () => (/* binding */ gamePoints)\n/* harmony export */ });\n\nfunction modal() {\n    const modalBtn = document.querySelector('.modal-button');\n    const modalBg = document.querySelector('.modal-bg');\n    const modalClose = document.querySelector('.modal-close');\n    const modalChild = document.querySelector('.modal-child');\n\n    modalBtn.addEventListener('click', function() {\n        modalBg.classList.add('bg-active')\n        modalChild.innerHTML = \"TESTING\"\n    })\n\n    modalClose.addEventListener('click', function() {\n        modalBg.classList.remove('bg-active');\n    })\n}\n\nfunction timer() {\n    let time = 120;\n    const countdownEl = document.querySelector('.countdown');\n    let t = setInterval(updateCountdown, 1000);\n\n    function updateCountdown() {\n        const minutes = Math.floor(time / 60)\n        let seconds = time % 60;\n\n        seconds = seconds < 10 ? '0' + seconds : seconds;\n\n        countdownEl.innerHTML = `${minutes}:${seconds}`\n\n        if (time > 0) time--;\n\n        if (time === 0) {\n\n        }\n    }\n}\n\nfunction gamePoints(word) {\n    \n}\n\n//# sourceURL=webpack:///./src/util.js?");

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