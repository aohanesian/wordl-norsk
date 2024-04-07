function uniqueRandom() {

    let generated = new Set();

    function generate() {
        let num = Math.random();
        if (generated.size === Number.MAX_SAFE_INTEGER) {
            throw new Error("infinity loop");
        }

        if (generated.has(num)) {
            return generate();
        } else {
            generated.add(num);
            return num;
        }
    }
    return generate;
}

let customRandom = uniqueRandom();

const getNorskKey = ((key) => {
    switch (key) {
        case "Æ": return "Quote";
        case "Ø": return "KeyO";
        case "Å": return "KeyA";
    }
})

const keyboard = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "Å"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ø", "Æ"],
    ["Enter", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
]

function fillInitialRows(worldList, width, answer) {
    let word1 = worldList[Math.floor(customRandom() * worldList.length)].norsk.toUpperCase();
    let word2;

    do {
        word2 = worldList[Math.floor(customRandom() * worldList.length)].norsk.toUpperCase();
    } while (hasCommonLetters(word1, word2) || !areAllLettersUnique(word2));

    if (answer === word1 || answer === word2 || hasDuplicatesUsingSet(word1) || hasDuplicatesUsingSet(word2)) return fillInitialRows(worldList, width, answer);

    for (let r = 0; r < 2; r++) {
        for (let c = 0; c < width; c++) {
            let currentTile = document.getElementById(r + "-" + c);
            currentTile.innerText = r === 0 ? word1[c] : word2[c];
        }
        simulateEvent();
    }

}

function hasCommonLetters(word1, word2) {
    return word1.split('').some(letter => word2.includes(letter));
}

function areAllLettersUnique(word) {
    const letterSet = new Set(word);
    return letterSet.size === word.length;
}

function hasDuplicatesUsingSet(str) {
    const charSet = new Set();
    for (const char of str) {
        if (charSet.has(char)) {
            return true;
        }
        charSet.add(char);
    }
    return false;
}

function simulateEvent() {
    const enterEvent = new KeyboardEvent("keyup", { code: "Enter", key: "Enter", altKey: false });
    document.dispatchEvent(enterEvent);
}

export { customRandom, keyboard, getNorskKey, fillInitialRows };
