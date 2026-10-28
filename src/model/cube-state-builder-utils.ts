export function removeComments(input?: string): { input?: string, comment?: string } {
  if (input?.includes('//')) {
    const splits = input.split('//')
    return {input: splits[0]!.trim(), comment: splits[1]?.trim()}
  } else
    return {input}
}

/**
 * @param str - gets checked
 * @returns true if given string starts and ends with '.'
 */
export function isWrappedInDots(str: string): boolean {
  return str.startsWith('.') && str.endsWith('.')
}
