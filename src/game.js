import { trieNode, add, fetchWord } from './trie.js';
import { gridNode, setUpGrid } from './gridNode.js'

let globalDictionary = null;

async function getDictionay() {
    const response = await fetch('dictionary.txt');
    const data = await response.text();
    globalDictionary = data.split(/\r?\n/).filter(word => {
        return word.length > 2
    })
}

async function game() {
    await getDictionay()
    const root = new trieNode(null);
    for (const item of globalDictionary)
        add(item, 0, root)
    
    let grid = setUpGrid()

    //next lets find all possible words with the letters that are given using the trieTree
    const gameWords = [];
    // for (let x = 0; x < grid.length; x++) {
    //     for (let y = 0; y < grid[0].length; y++) {
    //         console.log(`checking for ${grid[x][y][1].ch} at ${grid[x][y][1].coordinates}`)
    //         findWords(grid[x][y], root.map[grid[x][y][1].ch])
    //     }
    // }

    findWords(grid[0][0], root.map[grid[0][0].ch])
}
    

function findWords(gridNode, tree) {
    const words = [];
    const queue = [[tree, gridNode]];
    const visitedCells = [gridNode];

    while (queue.length) {
        debugger
        let ele = queue.shift();
        for (let i = 0; i < ele[1].neighbors.length; i++) {
            if (ele[0].complete) {
                let currentWord = fetchWord(ele[0])
                if (!words.includes(currentWord)) {
                    words.push(currentWord)
                }
            }
            //the visited cells function is breaking the functionality!!
            if (!visitedCells.includes(ele[1].neighbors[i])) {
                visitedCells.push(ele[1].neighbors[i])
                let char = ele[1].neighbors[i].ch
                let subTree = ele[0]
                if (subTree.map[char]) {
                    subTree = subTree.map[char];
                    //I just need to give it the next gridNode
                    queue.push([subTree, ele[1].neighbors[i]])
                }
            }
        }
    }
}

export default game