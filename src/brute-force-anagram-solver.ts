import readline from "readline";
import fs from "fs";

export class BruteForceAnagramSolver {
    private _wordList: string[];

    constructor() {
        this._wordList = [];
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
            this._findAnagrams(input);
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
        return rawDictionaryContents.split("\n");
    }

    public _findAnagrams(word: string) {
        const findStart = Date.now();

        const possibleAnagrams = this._generatePossibleAnagrams(word);
        // console.log(`DEBUG: ${possibleAnagrams.size} possible anagrams found`);
        const foundAnagrams = this._findAnagramsInDictionary(possibleAnagrams);
        foundAnagrams.sort();

        const findEnd = Date.now();
        const findDuration = findEnd - findStart;

        const numAnagrams = foundAnagrams.length;
        const output = numAnagrams === 0 ?
            `No anagrams found for ${word} in ${findDuration} ms` :
            numAnagrams === 1 ?
            `${numAnagrams} anagram found for ${word} in ${findDuration} ms\n${foundAnagrams.toString()}\n` :
            `${numAnagrams} anagrams found for ${word} in ${findDuration} ms\n${foundAnagrams.toString()}\n`;
        console.log(output);
    }

    private _generatePossibleAnagrams(word: string) {
        // const loadStart = Date.now();

        const possibleAnagrams = new Set<string>();
        if (word.length === 1) {
            possibleAnagrams.add(word);
        }
        const tupleStack: [string, string][] = [];
        tupleStack.push(["", word]);

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

        // const loadEnd = Date.now();
        // const loadDuration = loadEnd - loadStart;
        // console.log(`DEBUG: Anagram possibilities generated in ${loadDuration} ms`);
        return possibleAnagrams;
    }

    private _findAnagramsInDictionary(possibleAnagrams: Set<string>) {
        const foundAnagrams: string[] = [];

        possibleAnagrams.forEach((possibleAnagram) => {
            if (this._wordList.indexOf(possibleAnagram) != -1) {
                foundAnagrams.push(possibleAnagram);
            }
        });

        return foundAnagrams;
    }
}
