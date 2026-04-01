/**
 * 'no-buttons' - removes all buttons entirely
 * 'no-rotation' - removes all buttons related to rotation, which rn, are all of them
 */
const types = ['default', 'no-buttons'] as const; // TODO re-add 'no-rotation'

export type FlagType = (typeof types)[number];

export const Flags = {
  isFlag,
  types
}

function isFlag(value: string): value is FlagType {
  return (types as readonly string[]).includes(value);
}
