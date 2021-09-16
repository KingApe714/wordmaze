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
    for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid[0].length; y++) {
            console.log(`checking for ${grid[x][y].ch} at ${grid[x][y].coordinates}`)
            findWords(grid[x][y], root.map[grid[x][y].ch]).forEach(word => {
                if (!gameWords.includes(word)) {
                    gameWords.push(word)
                }
            })
        }
    }

    console.log(gameWords)
    // console.log("checking for [0][0]")
    // findWords(grid[0][0], root.map[grid[0][0].ch])
}
    

function findWords(gridNode, tree) {
    //gridNode could be my Adam
    const words = [];
    //pos 2 of all queued is the array of visited cells for that particular gridNode
    const queue = [[tree, gridNode, [gridNode]]];

    while (queue.length) {
        let ele = queue.shift();
        if (ele[0].complete) {
            let currentWord = fetchWord(ele[0])
            if (!words.includes(currentWord)) {
                words.push(currentWord)
            }
        }
        let visitedNodes = ele[2].slice()
        for (let i = 0; i < ele[1].neighbors.length; i++) {
            if (!visitedNodes.includes(ele[1].neighbors[i]) &&
                !ele[2].includes(ele[1].neighbors[i])) {

                let path = ele[2].slice()
                path.push(ele[1].neighbors[i])
                visitedNodes.push(ele[1].neighbors[i])

                let char = ele[1].neighbors[i].ch
                let subTree = ele[0]
                if (subTree.map[char]) {
                    subTree = subTree.map[char];
                    queue.push([subTree, ele[1].neighbors[i], path])
                }
            }
        }
    }
    console.log(words)
    return words
}

export default game