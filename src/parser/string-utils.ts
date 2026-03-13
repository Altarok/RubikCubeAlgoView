import {InputTypes, UserInput} from "../model/codeblock-input";
import {AlgorithmType} from "../model/algorithms";

export const StringUtils = {
  hash, cubeHash,
  codeBlockToStrings
};

/**
 * Create hash for persisting of metadata.
 */
function cubeHash(id: string | undefined, algorithmType: AlgorithmType): string | undefined {
  if (!id) {
    return undefined;
  }
  switch (algorithmType) {
    case'pll':
      return `pll-${id}-${StringUtils.hash('a grain of salt' + id)}`;
    case'oll':
      return `oll-${id}-${StringUtils.hash('a grain of salt' + id)}`;
  }
}

/**
 * Create 53 bit hash value.
 * Taken from https://stackoverflow.com/a/52171480
 */
function hash(str: string, seed = 0): string {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return '' + (4294967296 * (2097151 & h2) + (h1 >>> 0));

  // console.log(`cyrb53('a') -> ${cyrb53('a')}`)
  // console.log(`cyrb53('b') -> ${cyrb53('b')}`)
  // console.log(`cyrb53('revenge') -> ${cyrb53('revenge')}`)
  // console.log(`cyrb53('revenue') -> ${cyrb53('revenue')}`)
  // console.log(`cyrb53('revenue', 1) -> ${cyrb53('revenue', 1)}`)
  // console.log(`cyrb53('revenue', 2) -> ${cyrb53('revenue', 2)}`)
  // console.log(`cyrb53('revenue', 3) -> ${cyrb53('revenue', 3)}`)
}

/**
 * Takes complete code block content and returns all non-empty lines in a string array.
 * Removes comments. Removes prefixes.
 * TODO remove comment removal from other code
 * @param input - a code block's complete content
 */
function codeBlockToStrings(input: string): UserInput {
  let nonEmptyStrings = input.split('\n') // split lines
  .map(line => line.trim())
  .filter(Boolean); // skip empty lines, "" is falsy

  const userInput = new UserInput(nonEmptyStrings);

  for (const nonEmptyString of nonEmptyStrings) {

    /* Skip comment lines */
    if (nonEmptyString.startsWith('//')) continue;

    let strings = nonEmptyString.split(':');
    const key: string = strings[0] as string;
    let value: string = strings[1] as string;

    /* Skip falsy input */
    if (!key) continue;

    /* Remove comments, if any */
    if (value && value.includes('//')) value = (value.split('//')[0] as string).trim();


    if (InputTypes.includes(key) && value) {
      userInput.add(key, value);
      userInput.isEmpty = false;
    } else {
      userInput.addUnmarkedKey(key);
      userInput.isEmpty = false;
    }
  }

  // console.log('User input:\n' + userInput.toString());
  return userInput;
}
