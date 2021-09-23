import {OptimizedAnagramFinder} from "./optimized-anagram-finder";

console.log("Welcome to the Anagram Finder v1.1: Optimized");
console.log("---------------------------------------------");

if (! process.argv[2]) {
    console.log("No dictionary file provided. Exiting.");
    process.exit(1);
}
const filename = process.argv[2];

const finder = new OptimizedAnagramFinder();
finder.loadDictionary(filename);
finder.processInput();
