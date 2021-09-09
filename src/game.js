let globalDictionary = null;

async function game() {
    await getDictionay()
    console.log(globalDictionary)
}

async function getDictionay() {
    const response = await fetch('dictionary.txt');
    const data = await response.text();

    globalDictionary = data.split(/\r?\n/).filter(word => {
        return word.length > 2
    })

}

export default game