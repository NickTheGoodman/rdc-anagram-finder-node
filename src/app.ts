import {BruteForceAnagramFinder} from "./brute-force-anagram-finder";

console.log("Welcome to the Anagram Finder v1: Brute Force");
console.log("---------------------------------------------");

if (! process.argv[2]) {
    console.log("No dictionary file provided. Exiting.");
    process.exit(1);
}
const filename = process.argv[2];

const finder = new BruteForceAnagramFinder();
finder.loadDictionary(filename);
finder.processInput();
