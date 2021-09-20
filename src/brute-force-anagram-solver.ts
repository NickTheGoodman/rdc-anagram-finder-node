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
        console.log(`Dictionary loaded in ${loadDuration} ms`);
    }

    public processInput() {
        const ui = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        const wordPattern = /^[a-zA-Z]+$/s;
        const getInput = (input: string) => {
            if (input === "exit") {
                ui.close();
                return;
            }

            if (!wordPattern.test(input)) {
                console.log("Bad input.")
            } else {
                console.log(`Finding anagrams for: ${input}`);
                ui.emit('find_anagram', input);
            }
            ui.question('Enter another word. > ', getInput);
        };
        ui.question('Enter a word. > ', getInput);

        ui
        .on('find_anagram', (input: string) => this._findAnagram(input))
        .on("close", () => {
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
        return rawDictionaryContents.split("\n", 10);
    }

    private _findAnagram(word: string) {

    }
}
