import readline from "readline";
import fs from "fs";

// Map lowercase words to equivalent words of various cases
//   Key: Lowercase word
//   Value: An array of words with the same letters as the key in any combination of uppercase or lowercase
interface UppercaseToOriginalWordsMap {
    [lowercaseWord: string]: string[]
}

export class BruteForceAnagramFinder {
    private _wordList: UppercaseToOriginalWordsMap;

    constructor() {
        this._wordList = {};
    }

    public loadDictionary(filename: string) {
        const loadStart = Date.now();

        const rawDictionary = this._readDictionaryFile(filename);
        this._wordList = this._processDictionary(rawDictionary);

        const loadEnd = Date.now();
        const loadDuration = loadEnd - loadStart;
        console.log(`Dictionary loaded in ${loadDuration} ms\n`);
    }

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

    private _processDictionary(rawDictionaryContents: string) {
        const dictionaryMap: UppercaseToOriginalWordsMap = {};

        const originalDictionary = rawDictionaryContents.split("\n");
        originalDictionary.map((word) => {
            const uppercaseWord = word.toUpperCase();
            if (! dictionaryMap[uppercaseWord]) {
                dictionaryMap[uppercaseWord] = [];
            }
            dictionaryMap[uppercaseWord].push(word);
        });

        return dictionaryMap;
    }

    public _findAnagrams(word: string) {
        const findStart = Date.now();

        const possibleAnagrams = this._generatePossibleAnagramsAsUppercase(word);
        // console.log(`DEBUG: ${possibleAnagrams.size} possible (case-insensitive) anagrams found`);
        const foundAnagrams = this._findAnagramsInDictionary(possibleAnagrams);
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

    private _generatePossibleAnagramsAsUppercase(word: string) {
        const tupleStack: [string, string][] = [];
        const possibleAnagrams = new Set<string>();
        // Unify the case of all letters in the original word to support case-insensitive searching later
        const uppercaseWord = word.toUpperCase();

        if (uppercaseWord.length === 1) {
            possibleAnagrams.add(uppercaseWord);
        }
        tupleStack.push(["", uppercaseWord]);

        while(tupleStack.length > 0) {
            const tuple = tupleStack.pop();
            const prevChars = tuple[0];
            const curChars = tuple[1];

            for (let i = curChars.length - 1; i >= 0; i--) {
                const leftChars = curChars.slice(0, i);
                const middleChar = curChars[i];
                const rightChars = curChars.slice(i+1, curChars.length);

                const charsSoFar = prevChars + middleChar;
                const nextChars = leftChars + rightChars;
                if (nextChars.length === 1) {
                    possibleAnagrams.add(charsSoFar + nextChars);
                } else {
                    tupleStack.push([charsSoFar, nextChars]);
                }
            }
        }

        return possibleAnagrams;
    }

    private _findAnagramsInDictionary(possibleAnagrams: Set<string>) {
        let foundAnagrams: string[] = [];

        possibleAnagrams.forEach((possibleAnagram) => {
            const originalWords = this._wordList[possibleAnagram];
            if (originalWords) {
                foundAnagrams = foundAnagrams.concat(originalWords);
            }
        });

        return foundAnagrams;
    }
}
