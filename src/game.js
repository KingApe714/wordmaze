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

// const puppeteer = require('puppeteer-core')

// async function scrapeProduct(url) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage()
//     await page.goto(url);

//     const [el] = await page.$x('//*[@id="tsuid17"]/span/div/div/div[3]/div/div[4]/div/div/ol/li/div/div/div[1]/div/div/div[1]/span')
//     const src = await el.getProperty('src')
//     const srcTxt = src.jsonValue()

//     console.log({srcTxt})
// }

async function game() {
    await getDictionay()
    const root = new trieNode(null);
    for (const item of globalDictionary)
        add(item, 0, root)
    
    modal()
    
    // scrapeProduct('https://www.google.com/search?q=definition+of+google&oq=definition+of+google&aqs=chrome..69i57.6749j0j9&sourceid=chrome&ie=UTF-8')


    let [grid, completeNodes, gamePoints] = setUpGrid(root)
    
    timer(grid, completeNodes, gamePoints)
}

export default game