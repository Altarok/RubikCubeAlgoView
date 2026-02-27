export const Snippets = {
  hash
};

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
