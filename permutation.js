/*
    ** To Use ** 
Set array for WORDS variable on line 52
Call the comparePermutationsToTargets() function with an argument that is the string of letters you want to check for permutations.


    ** Assignment Instructions ** 
Here's the coding challenge I mentioned. Please focus on writing readable, production-quality code. You don't need to worry about performance, although feel free to 
include a couple notes about performance improvements you may notice along the way. 

Coding challenge:

Please write a function that accepts a single string as input, and that returns a list of English words that can be created using some combination of the letters in 
the input string.
 
Example input: "oogd"
Example output: ["good", "god", "dog", "goo", "do", "go"]
 
You can assume you'll be given an array of strings that enumerates all valid English words. To determine whether a word is a valid word, you can simply check for 
its presence in the array (e.g., `WORDS.includes(word)`)


    ** Performance Notes ** 

The optimal structure for this kind of permutation computation is a heap.  If performance was critical I would rewrite it to utilize that data structure.

Case sensitivity is not being handled.  This would not be a problem to include in another version and it would add computations. 

A big factor for slowing things down is the linear pass through the list of words for Array.includes().  This is where I would want to focus most of my imediate efforts.
This would be especially important as the length of the string and the number of target words increased.

    * Conversion to a hashset would allow for constant time lookup after a single linear pass through that array at a cost of a linear amount of extra space.
    * Duplication of the word array/set of words into a trie data structure would allow for a lot of performance increases in the permutation calculation.
        ** For example if there is an 'x' in the input string and none of the words in the array of words include an x character we can use the trie to immediately stop as we 
        get to the x character.  That concept extends and is very impactful.
    * If for some reason we couldn't use the trie data structure we could mimic that functionality by building a hashset of every 1,2,3,4 character prefix of every word 
    within the original array of words.  This would give us constant lookup to know if we were building a permutation that was never going to go anywhere.
    * Usage of dynamic programing via memoization would be immensely helpful.  A tremendous amount of time would be spent building permutations.  Some of these would be 
    duplicated effort, especially as the input string grows longer.  Using a cache to track which prefixes actually do build out to a word would reduce computations by
    reducing effort spent building out permutations that do not build toward a target word.
    * As the length of the input string increases it would become worthwhile to make a linear pass through the initial array of words to get the maximum length of any word 
    included.
        ** With 20 characters there are roughly 2,432,902,008,176,640,000 permutations. If the longest word is 10 characters we only need to use 10,240,000,000,000 
        of those permutations and we can save the time by not computing the rest (calculations from an online resource).
    * One single pass through that array of words could be used to implement several of the above tricks to speed things up.
    * A much less effecient option (still more effecient than using Array.includes()) that would help in some implementations would be if the array of words was long and not 
    updated often, and multiple permutations searches were done on this built array of words would be to sort that array and use binary search.  The time to sort would be a
    single hit and on subsequent searches wouldn't be a factor (until target words changed) and binary search's logarithmic runtime would help.
*/


const WORDS = ["good", "god", "dog", "goo", "do", "go"];

/*
  Create a count of the frequency of each letter within a string.

  Input: string
  Output: Object

  input: "apple"
  output: {
    a : 1,
    p : 2,
    l : 1,
    e : 1
  }
*/
const buildLetterCount = str => {
  const letterCount = {};

  for (let i = 0; i < str.length; i++) {
    letterCount[str[i]] ? letterCount[str[i]]++ : letterCount[str[i]] = 1;
  }

  return letterCount;
};

/*
Takes in a permutation that may be a match for a target word from WORDS array (line 52).  If it does match it returns true, else it returns false.

Input: string
Output: boolean

as per the instructions: 
    you can simply check for its presence in the array (e.g., `WORDS.includes(word)`

TODO: Please see Performance notes on line 23 for details about improvements
*/
const checkWord = word => {
    return WORDS.includes(word);
};

/*
  Find every permutation of character combinations within a given string and returns those permutations.

  Input: string
  Output: Array of strings

  Input: 'abc'
  Output: ['a','ab','ac','abc','acb','b','ba','bc','bca','bac','c','ca','cb','cab','cba']
*/
const permutations = str => {
  if (!str.length) return [];

  const allPermutations = [];
  const orignialLetterCount = buildLetterCount(str);

  const permutationHelper = (letterCount, str) => {
    for (let key in letterCount) {
      if (letterCount[key]) {
        const endRecursion = Object.values(letterCount).every( value => value == 0);

        if (endRecursion) {
          return;
        }

        const newLetterCount = {};
        const newStr = str+key;

        for (let updatedKey in letterCount) {
          if (key === updatedKey) {
            newLetterCount[updatedKey] = letterCount[key] - 1;
          } else {
            newLetterCount[updatedKey] = letterCount[updatedKey];
          }
        }

        allPermutations.push(newStr);
        permutationHelper(newLetterCount, newStr);
      }
    }
    return;
  };

  permutationHelper(orignialLetterCount, '');
  return allPermutations;
};

/*
    Calls a function to get permutations of a string, then checks to see if those permutations are included in an array of target strings.

    Input: string
    Output: array of strings

    Input: "oogd"
    Output: ["good", "god", "dog", "goo", "do", "go"]
*/
const comparePermutationsToTargets = (str) => {
    if (!str || !str.length) {
      throw new Error('There is no input string to run permutations on.');
    } else if (!WORDS.length || !Array.isArray(WORDS)) {
      throw new Error('There are no words within the WORDS array, or WORDS is not an array.');
    }
    const allPermutations = permutations(str);

    return allPermutations.filter( permutation => checkWord(permutation));
};