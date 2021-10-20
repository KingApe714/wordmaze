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
    
    let [grid, completeNodes, gamePoints] = setUpGrid(root)
    
    timer(grid, completeNodes, gamePoints)
}

export default game