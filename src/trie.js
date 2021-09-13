export function trieNode(ch) {
    this.ch = ch;
    this.complete = false;
    this.map = {};
    this.parent = null;
    this.words = [];
}

export function add(str, i, root) {
    if (i === str.length) {
        root.complete = true;
        return
    }

    if (!root.map[str[i]]) {
        root.map[str[i]] = new trieNode(str[i])
        root.map[str[i]].parent = root;
    }

    root.words.push(str);
    add(str, i + 1, root.map[str[i]]);
}

export function search(str, i, root) {
    if (i === str.length) 
        return root.words;

    if (!root.map[str[i]])
        return [];
    
    return search(str, i+1, root.map[str[i]]);
}

export function fetchWord(currentNode) {
    let nodeCheck = currentNode;
    let word = '';
    while(nodeCheck.parent !== null) {
        word = nodeCheck.ch + word;
        nodeCheck = nodeCheck.parent;
    }
    
    return word;
}