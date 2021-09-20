# Anagram Finder

Note: this repo was written in WSL on Windows using Ubuntu 20.04 LTS image.

## Time Tracking
- Day 1 [4 hrs]
    - Work through some examples on paper
    - Write pseudo-code for the initial, quick-and-dirty solution
    - Some (unfinished) planning for the optimized solutions 
    - Setup initial repo skeleton 
- Day 2 [4 hrs]
    - Implement dictionary loading and input processing in BruteForceAnagramSolver class
- Day 3 [6 hrs]
    - Finish implementation of BruteForceAnagramSolver
    - Use a Set for storing anagram possibilities to remove dupes
    - Handle whitespace in input
    - Write README instructions
    - Cleanup output
  
## Notes and Assumptions About Anagrams
- Anagrams are case-insensitive. For example, "Cinema" is an anagram of "iceman".
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
$ npm run transpile

> rdc-anagram-finder-node@1.0.0 transpile
> tsc

```
- Run the app, passing in a single positional argument: a path to a dictionary .txt file.
```shell
$ npm start ./dictionary-data/dictionary.txt

> rdc-anagram-finder-node@1.0.0 start
> node dist/src/app.js "./dictionary-data/dictionary.txt"

Welcome to the Anagram Finder v1: Brute Force
---------------------------------------------
Dictionary loaded in 24 ms
Enter a word. > 
```
- When prompted, either provide a single word or "exit" to kill the app.
  Phrases will be rejected, but leading/trailing whitespace are ok.
```shell
Enter a word. > post
Finding anagrams for: post
4 anagrams found for post in 9 ms
post,spot,stop,tops

Enter another word. > ice man
Bad input.

Enter another word. >     iceman
Finding anagrams for: iceman
3 anagrams found for iceman in 330 ms
anemic,cinema,iceman

Enter another word. > exit
Exiting.
```
- Note: since "exit" serves as an input command to exit the app,
  in order to run the AnagramSolver on the actual word "exit",
  simply provide an anagram of "exit" such as "tixe". The anagram you provide does not have
  to be in the dictionary to trigger the AnagramSolver.
```shell
Enter another word. > tixe
Finding anagrams for: tixe
1 Anagrams found for tixe in 9ms
exit

```