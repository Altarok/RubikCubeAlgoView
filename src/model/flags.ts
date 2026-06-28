// /**
//  * 'no-buttons' - removes all buttons entirely
//  * 'no-rotation' - removes all buttons related to rotation, which rn, are all of them TODO re-add
//  */
// export const SHOW_CARBONS: readonly ShowCarbonsType[] = [
//   'none', 'default', 'terminal', 'acyclic', 'all'
// ] as const

// const FlagTypes = [
//   /* Does nothing */
//   'default',
//   /* Removes buttons (not only hide) */
//   'no-buttons',
//   /* Removes setup algorithm (not only hide) */
//   'no-setup',
// ] as const

export type FlagType = 'default' | 'no-buttons' | 'no-setup'

// (typeof FlagTypes)[number]

const FlagTypes: readonly FlagType[] = [
  'default', 'no-buttons', 'no-setup'
] as const


export const Flags = {
  isFlag,
  FlagTypes
}

function isFlag(value: string): value is FlagType {
  return (FlagTypes as readonly string[]).includes(value)
}
