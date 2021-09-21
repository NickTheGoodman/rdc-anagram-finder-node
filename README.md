# Anagram Finder

This AnagramFinder app was written in Typescript and is executed in Node.js.
It was developed in Windows Subsystem for Linux using an Ubuntu 20.04 LTS image.

## Time Tracking
- Day 1 [4 hrs]
    - Work through some examples on paper
    - Write pseudo-code for the initial, quick-and-dirty solution
    - Some (unfinished) planning for the optimized solutions 
    - Setup initial repo skeleton 
- Day 2 [4 hrs]
    - Implement dictionary loading and input processing in BruteForceAnagramSolver class
- Day 3 [9 hrs]
    - Finish initial implementation of BruteForceAnagramSolver
    - Use a Set for storing anagram possibilities to remove dupes
    - Handle whitespace in input
    - Write README instructions
    - Cleanup output
    - Switch to using an index signature for the dictionary data structure,
      mapping the UPPERCASE version of a word to a list of all its case-varying forms,
      to make the anagram search case-insensitive.
  
## Notes and Assumptions About Anagrams
- The anagram solver will search for anagrams in a case-insensitive manner.
  For example, "Cinema" is an anagram of "iceman".
- If a user provides a combination of letters that is not actually a word in the provided dictionary,
  the AnagramSolver won't care; it will still look for anagrams of those letters.
  
## Build and Execution Instructions

- Ensure you have node installed at least version 16.
- Run a local npm install:
```shell
$ npm install
```
- Transpile the typescript source into executable javascript:
```shell
$ npm run build

> rdc-anagram-finder-node@1.0.0 build
> tsc

```
- Run the app, passing in a single positional argument: a path to a dictionary .txt file.
```shell
$ npm start dictionary-data/dictionary.txt

> rdc-anagram-finder-node@1.0.0 start
> node dist/src/app.js "dictionary-data/dictionary.txt"

Welcome to the Anagram Finder v1: Brute Force
---------------------------------------------
Dictionary loaded in 206 ms

Enter a word. >
```
- When prompted, either provide a single word to find anagrams for, or "exit" to kill the app.
  Phrases will be rejected, but leading/trailing whitespace are ok.
  Case doesn't matter; the AnagramSolver will find all anagrams
  regardless of the case of either the input word or the words in the dictionary.
```shell
Enter a word. > post
Finding anagrams for: post
4 anagrams found for post in 0 ms
post,spot,stop,tops

Enter another word. > maca roni
Bad input.

Enter another word. >     macaroni
Finding anagrams for: macaroni
3 anagrams found for macaroni in 19 ms
armonica,macaroni,marocain

Enter another word. > a
Finding anagrams for: a
2 anagrams found for a in 0 ms
A,a

Enter another word. > Aa
Finding anagrams for: Aa
1 anagram found for Aa in 0 ms
aa

Enter another word. > exit
Exiting.
```
- Note: Because "exit" serves as an input command to exit the app,
  you cannot find this word's anagrams by typing "exit."
  In order to do so, take advantage of the case-insensitivity of the input and
  simply provide an uppercase version of the word.
```shell
Enter another word. > Exit
Finding anagrams for: Exit
1 anagram found for Exit in 0ms
exit
```