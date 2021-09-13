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

    //for ele, tree is position 0 and gridNode is position 1
    //for gridNode tile is position 0 and node is position 1
    while (queue.length) {
        // console.log(queue)
        debugger
        let ele = queue.shift();
        for (let i = 0; i < ele[1].neighbors.length; i++) {
            if (ele[0].complete) {
                console.log('finished word')
                console.log(ele[0])
                let currentWord = fetchWord(ele[0])
                if (!words.includes(currentWord)) {
                    words.push(currentWord)
                }
            }
            if (!visitedCells.includes(ele[1].neighbors[i])) {
                visitedCells.push(ele[1].neighbors[i])
                //grab the char of the current neighbor
                // console.log(`${ele[1][1].coordinates} ${ele[1][1].ch}`)
                // console.log(ele[1][1].neighbors[i][1].ch)
                let char = ele[1].neighbors[i].ch
                // console.log(char)
                let subTree = ele[0]
                // console.log(subTree)
                if (subTree.map[char]) {
                    subTree = subTree.map[char];
                    console.log(char)
                    console.log(subTree)
                    //I just need to give it the next gridNode
                    queue.push([subTree, ele[1].neighbors[i]])
                }
            }
            // console.log('visitedCells')
            // console.log(visitedCells)
        }
    }
    console.log(gridNode.coordinates)
    console.log(words)
}

export default game