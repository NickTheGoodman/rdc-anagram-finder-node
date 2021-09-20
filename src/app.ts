import {BruteForceAnagramSolver} from "./brute-force-anagram-solver";

console.log("Welcome to the Anagram Finder v1: Brute Force");
console.log("---------------------------------------------");

if (! process.argv[2]) {
    console.log("No dictionary file provided. Exiting.");
    process.exit(1);
}
const filename = process.argv[2];

const solver = new BruteForceAnagramSolver();
solver.loadDictionary(filename);
solver.processInput();
