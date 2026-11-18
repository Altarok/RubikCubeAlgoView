/**
 * Splits given string, but only at first appearance of the separator. Call like this:<br>
 * <code>const {left: key, right: value} = splitOnce(line, ':')</code><br>
 * If the separator isn't found, returns the whole string as 'left' and an empty 'right'
 * @param splitMe string to be split
 * @param separator
 * @return <code>{left:string, right:string}</code>. Every returned value is trimmed.
 */
export function splitOnce(splitMe: string, separator: string): { left: string, right: string } {
  const index = splitMe.indexOf(separator)
  if (index === -1) {
    return {left: splitMe.trim(), right: ''}
  }
  const left = splitMe.slice(0, index).trim()
  const right = splitMe.slice(index + 1).trim()
  return {left, right}
}
