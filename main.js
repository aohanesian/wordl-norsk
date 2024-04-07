import { customRandom, keyboard, getNorskKey, fillInitialRows } from "./utils.js";
import data from "./vocabulary.js";

const height = 6;
const width = 5;

let row = 0;
let col = 0;

let isGameOver = false;
const worldList = data;

let word = worldList[Math.floor(customRandom() * worldList.length)].norsk.toUpperCase();

console.log(word);

function initialize() {
    //render tiles
    for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
            //<span id="0-0" class="tile">{letter}<span>
            let tile = document.createElement("span");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.innerText = '';
            document.getElementById("board").appendChild(tile);
        }
    }

    //render keyboard
    for (let i = 0; i < keyboard.length; i++) {
        let currentRow = keyboard[i];
        let keyboardRow = document.createElement('div');
        keyboardRow.classList.add('keyboard-row')

        for (let j = 0; j < currentRow.length; j++) {
            let keyTile = document.createElement('div');
            keyTile.classList.add('key-tile');
            let key = currentRow[j];
            keyTile.innerText = key;

            switch (key) {
                case "Enter":
                    keyTile.code = "Enter";
                    keyTile.key = "Enter";
                    keyTile.altKey = false;
                    keyTile.id = "Key" + key;
                    break;
                case "⌫":
                    keyTile.code = "Backspace";
                    keyTile.key = "Backspace";
                    keyTile.altKey = false;
                    keyTile.id = "Key" + key;
                    break;
                case "Æ":
                case "Ø":
                case "Å":
                    keyTile.code = getNorskKey(key);
                    keyTile.key = key;
                    keyTile.altKey = true;
                    keyTile.id = "Key" + key;
                    break;
                default:
                    if ("A" <= key && key <= "Z") {
                        keyTile.code = "Key" + key;
                        keyTile.key = key;
                        keyTile.altKey = false;
                        keyTile.id = "Key" + key;
                    }
            }


            keyTile.addEventListener("click", processKey);

            if (key === "Enter" || key === "⌫") {
                keyTile.classList.add("enter-key-tile");
            } else {
                keyTile.classList.add("key-tile");
            }
            keyboardRow.appendChild(keyTile);
        }
        document.getElementById("keyboardWrapper").appendChild(keyboardRow);
    }

    document.addEventListener('keyup', (event) => {
        processInput(event);
    })

    function processKey() {
        let event = { "code": this.code, "key": this.key, "altKey": this.altKey };
        processInput(event);
    }

    function processInput(event) {

        if (isGameOver) return;

        if ("KeyA" <= event.code && event.code <= "KeyZ" || (event.code === "Quote" && event.altKey === true)) {
            if (col < width) {
                let currentTile = document.getElementById(row.toString() + "-" + col.toString())
                if (currentTile.innerText === "") {
                    let letter = ["Quote", "Æ", "Ø", "Å", "æ", "ø", "å"].includes(event.key) ? event.key.toUpperCase() : event.code[3]
                    currentTile.innerText = letter;
                    col += 1;
                }
            }
        } else if (event.code === "Backspace") {
            if (0 < col && col <= width) {
                col -= 1;
            }
            let currentTile = document.getElementById(row.toString() + "-" + col.toString())
            currentTile.innerText = "";
        } else if (event.code === "Enter") {
            update();
        }

        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                let tile = document.getElementById(i.toString() + "-" + j.toString());
                tile.classList.remove('active');
            }
        }

        let currentTile = document.getElementById(row.toString() + "-" + col.toString());
        currentTile.classList.add('active');

        if (!isGameOver && row === height) {
            isGameOver = true;
            document.getElementById('answer').innerText = word;
        }
    }

    function update() {

        let guess = '';

        for (let c = 0; c < width; c++) {
            let currentTile = document.getElementById(row.toString() + "-" + c.toString());
            let letter = currentTile.innerText;
            guess += letter.toLowerCase();
        }

        if (guess.length < width) {
            document.getElementById('answer').innerText = 'Enter 5 letters';
            return;
        }

        if (!worldList.map(item => item.norsk).includes(guess)) {
            document.getElementById('answer').innerText = 'Word does not exist in the game vocabulary';
            return;
        }

        let correct = 0;
        let letterCount = {};

        for (let i = 0; i < word.length; i++) {
            let letter = word[i];
            if (letterCount[letter]) {
                letterCount[letter] += 1;
            } else {
                letterCount[letter] = 1;
            }
        }

        //first iteration
        for (let c = 0; c < width; c++) {
            let currentTile = document.getElementById(row.toString() + "-" + c.toString());
            let letter = currentTile.innerText;

            if (word[c] === currentTile.innerText) {
                currentTile.classList.add('correct');
                let keyTile = document.getElementById("Key" + letter);
                keyTile.classList.remove('present');
                keyTile.classList.add('correct')
                correct += 1;
                letterCount[letter] -= 1;
            }

            if (correct === width) {
                isGameOver = true;
            }
        }

        //second iteration
        for (let c = 0; c < width; c++) {
            let currentTile = document.getElementById(row.toString() + "-" + c.toString());
            let letter = currentTile.innerText;

            if (!currentTile.classList.contains('correct')) {
                if (word.includes(letter) && letterCount[letter] > 0) {
                    currentTile.classList.add('present');
                    let keyTile = document.getElementById("Key" + letter);
                    if (!keyTile.classList.contains('correct')) {
                        keyTile.classList.add('present');
                    }
                    correct += 1;
                    letterCount[letter] -= 1;
                } else {
                    let keyTile = document.getElementById("Key" + letter);
                    keyTile.classList.add('absent')
                    currentTile.classList.add('absent')
                }
            }
        }

        row += 1;
        col = 0;
        document.getElementById('answer').innerText = '';
    }
}

window.onload = function () {
    initialize();
    fillInitialRows(worldList, width, word);
};