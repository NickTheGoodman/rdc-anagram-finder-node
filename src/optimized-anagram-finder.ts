import readline from "readline";
import fs from "fs";

interface LetterMap {
    [letter: string]: {
        isLastLetter: boolean,
        nextLetters: LetterMap,
    }
}

export class OptimizedAnagramFinder {
    private _letterMap: LetterMap;
    constructor() {
        this._letterMap = {};
    }

    public loadDictionary(filename: string) {
        const loadStart = Date.now();

        const rawDictionary = this._readDictionaryFile(filename);
        const dictionaryArray = rawDictionary.split('\n');

        this._letterMap = this._loadLetterMapFromDictionary(dictionaryArray);

        const loadEnd = Date.now();
        const loadDuration = loadEnd - loadStart;
        console.log(`Dictionary loaded in ${loadDuration} ms\n`);
    }

    private _readDictionaryFile(filename: string) {
        let dictionary = "";
        try {
            dictionary = fs.readFileSync(filename, 'utf-8');
        } catch (err: any) {
            console.log(`error reading dictionary file: ${err}`);
            process.exit(1)
        }
        return dictionary;
    }

    private _loadLetterMapFromDictionary(dictionary: string[]) {
        const letterMap = {};
        dictionary.map((word) => {
            let curLetterMap = letterMap;
            for (let i = 0; i < word.length; i++) {
                const letter = word.charAt(i);
                const curLetterIsLastLetterInWord = i == word.length - 1;

                if (! curLetterMap[letter]) {
                    curLetterMap[letter] = {
                        isLastLetter: curLetterIsLastLetterInWord,
                        nextLetters: {},
                    };
                } else {
                    if (! curLetterMap[letter].isLastLetter) {
                        curLetterMap[letter].isLastLetter = curLetterIsLastLetterInWord;
                    }
                }
                curLetterMap = curLetterMap[letter].nextLetters;
            }
        });
        return letterMap;
    };

    public processInput() {
        const ui = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        const wordPattern = /^\s*[a-zA-Z]+\s*$/s;
        const getInput = (input: string) => {
            if (input === "exit") {
                ui.close();
                return;
            }

            if (!wordPattern.test(input)) {
                console.log("Bad input.\n")
            } else {
                input = input.trim();
                console.log(`Finding anagrams for: ${input}`);
                ui.emit('find_anagram', input);
            }
            ui.question('Enter another word. > ', getInput);
        };
        ui.question('Enter a word. > ', getInput);

        ui.on('find_anagram', (input: string) => {
            console.log(this._findAnagrams(input));
        }).on("close", () => {
            console.log("Exiting.");
            process.exit(0);
        });
    }

    private _findAnagrams(word: string) {
        const findStart = Date.now();

        const foundAnagrams = Array.from(this._findAnagramsInLetterMap(word));
        foundAnagrams.sort();

        const findEnd = Date.now();
        const findDuration = findEnd - findStart;
        const numAnagrams = foundAnagrams.length;
        return numAnagrams === 0 ?
            `No anagrams found for ${word} in ${findDuration} ms\n` :
            numAnagrams === 1 ?
                `${numAnagrams} anagram found for ${word} in ${findDuration} ms\n${foundAnagrams.toString()}\n` :
                `${numAnagrams} anagrams found for ${word} in ${findDuration} ms\n${foundAnagrams.toString()}\n`;
    }

    private _findAnagramsInLetterMap(word: string) {
        const tupleStack: [string, string][] = [];
        const foundAnagrams = new Set<string>();

        tupleStack.push(["", word]);
        while (tupleStack.length > 0) {
            const tuple = tupleStack.pop();
            const prevChars = tuple[0];
            const curChars = tuple[1];
            const curLetterMap = this._getLastLetterMap(prevChars);

            for (let i = 0; i < curChars.length; i++) {
                const leftChars = curChars.slice(0, i);
                const rightChars = curChars.slice(i + 1, curChars.length);
                const nextChars = leftChars + rightChars;

                const curCharInBothCases = this._getBothCasesForLetter(curChars[i]);
                for (const curChar of curCharInBothCases) {
                    // console.log(`DEBUG: curChar: ${curChar} | nextChars: ${nextChars}`)

                    if (curLetterMap[curChar]) {
                        if (nextChars.length > 0) {
                            tupleStack.push([prevChars + curChar, nextChars]);
                        } else if (curLetterMap[curChar].isLastLetter) {
                            foundAnagrams.add(prevChars + curChar);
                        }
                    }
                }
            }
        }

        return foundAnagrams;
    }

    // Return "nextLetters" of the last letter of the given substring.
    // Assume all layers of nextLetters exist for the letters in the substring.
    private _getLastLetterMap(substring: string) {
        let curLetterMap = this._letterMap;
        for (let i = 0; i < substring.length; i++) {
            const curLetter = substring.charAt(i);
            curLetterMap = curLetterMap[curLetter].nextLetters;
        }
        return curLetterMap;
    }

    private _getBothCasesForLetter(letter: string): [string, string] {
        if (letter.length !== 1) {
            throw new Error("ERROR: Passed multiple characters to _getBothCasesForLetter()");
        }
        return [letter.toLowerCase(), letter.toUpperCase()];
    }

}
