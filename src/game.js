import { trieNode, add, fetchWord } from './trie.js';
import { gridNode, setUpGrid, findWords } from './gridNode.js'
import { modal, timer } from './util.js'

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
    
    modal()
    timer()

    let grid = setUpGrid(root)

    //next lets find all possible words with the letters that are given using the trieTree
    const gameWords = [];
    // for (let x = 0; x < grid.length; x++) {
    //     for (let y = 0; y < grid[0].length; y++) {
    //         console.log(`checking for ${grid[x][y].ch} at ${grid[x][y].coordinates}`)
    //         findWords(grid[x][y], root.map[grid[x][y].ch]).forEach(word => {
    //             if (!gameWords.includes(word)) {
    //                 gameWords.push(word)
    //             }
    //         })
    //     }
    // }

    // console.log(gameWords)
    // console.log("checking for [0][0]")
    // findWords(grid[0][0], root.map[grid[0][0].ch])
}
    



export default game