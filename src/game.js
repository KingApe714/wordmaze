import { trieNode, add } from './trie.js';

let globalDictionary = null;

async function game() {
    await getDictionay()
    const root = new trieNode(null);
    for (const item of globalDictionary)
        add(item, 0, root)
    
    console.log(globalDictionary)
    console.log(root)
}

async function getDictionay() {
    const response = await fetch('dictionary.txt');
    const data = await response.text();

    globalDictionary = data.split(/\r?\n/).filter(word => {
        return word.length > 2
    })

}

export default game