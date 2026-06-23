type OllPatternLine1 = `${'t' | 'b' | 'l'}${'t' | 'b'}${'t' | 'b' | 'r'}` // read as; top|back/front|left/right
type OllPatternLine2 = `${'t' | 'l'}t${'t' | 'r'}`
type OllPatternLine3 = `${'t' | 'f' | 'l'}${'t' | 'f'}${'t' | 'f' | 'r'}`
type OllPattern = `${OllPatternLine1}.${OllPatternLine2}.${OllPatternLine3}`

type PredefinedCase = { id: number; desc: string; algorithms: string[] }

export type PredefinedCaseRubikOll = PredefinedCase & { ollPattern: OllPattern }
export type PredefinedCaseRubikPll = PredefinedCase & { arrows: string }

const toRecord = <T extends PredefinedCase>(prefix: string, cases: T[]): Record<string, T> => Object.fromEntries(cases.map(s => [`${prefix}-${s.id}`, s]))

const ollCases: PredefinedCaseRubikOll[] = [ // @fof
  { id: 1, desc: 'Dot', ollPattern: 'lbr.ltr.lfr', algorithms: ["R U2 R2 F R F' U2 R' F R F' == 2+4,6+8,3-7,7-9,9-3"] },
  { id: 2, desc: 'Dot', ollPattern: 'bbb.ltr.lfr', algorithms: ["r U r' U2 r U2 R' U2 R U' r' == 2+4,6+8,1+9,3+7", "L F U F' U' L' l F U F' U' l' == 2+6,4+8", "L F U F' U' M F U F' U' l' == 2+6,4+8"] },
  { id: 3, desc: 'Dot', ollPattern: 'bbr.ltr.tff', algorithms: ["r' R2 U R' U r U2 r' U M' == 2-6-8-4,1-7-9-3", "R U B U' B' R' U R B U B' U' R' == 2-8-6-4,1-7-9-3", "l F U F' U' l' U' L F U F' U' L' == 1-3-9-7,4+8"] },
  { id: 4, desc: 'Dot', ollPattern: 'lbb.ltr.fft', algorithms: ["M U' r U2 r' U' R U' R' M' == 1-3-9-7,2-4-8-6", "R U B U' B' R' U' R B U B' U' R' == 1-3-9-7,2-4-6-8", "l F U F' U' l' U L F U F' U' L' == 1-7-9-3,2+6"] },
  { id: 5, desc: 'Square Shape', ollPattern: 'ttr.ttr.lff', algorithms: ["l' U2 L U L' U l == 1+9,3+7,4-6-8"] },
  { id: 6, desc: 'Square Shape', ollPattern: 'ltt.ltt.fft', algorithms: ["r U2 R' U' R U' r' == 1+9,3+7,4-8-6"] },
  { id: 7, desc: 'Small Lightning Bolt', ollPattern: 'btr.ttr.tff', algorithms: ["r U R' U R U2 r' == 1+9,3+7,4-6-8"]},
  { id: 8, desc: 'Small Lightning Bolt', ollPattern: 'ltb.ltt.fft', algorithms: ["l' U' L U' L' U2 l == 1+9,3+7,4-8-6", "R U2 R' U2 R' F R F' == 1-9-7,4-8-6"]},
  { id: 9, desc: 'Fish Shape', ollPattern: 'ltb.ttr.fft', algorithms: ["R U R' U' R' F R2 U R' U' F' == 1-9-7,2-6-8"]},
  { id: 10, desc: 'Fish Shape', ollPattern: 'bbt.ttr.ltf',algorithms: ["R U R' U R' F R F' R U2 R' == 1+3,7+9", "l U L' U L U' L' U' l' L U L U' L' == 1+9,3+7,2+6,4+8"]},
  { id: 11, desc: 'Small Lightning Bolt', ollPattern: 'btt.ttr.lff',algorithms: ["r U R' U R' F R F' R U2 r' == 1+3,7+9", "l' L2 U L' U L U2 L' U M == 1-7-9-3,6+8"]},
  { id: 12, desc: 'Small Lightning Bolt', ollPattern: 'ttb.ltt.ffr', algorithms: ["M' R' U' R U' R' U2 R U' R r' == 1-3-9-7,4+8"]},
  { id: 13, desc: 'Knight Move Shape', ollPattern: 'bbr.ttt.tff', algorithms: ["F U R U' R2 F' R U R U' R' == 2-8-6,1-7-9", "r U' r' U' r U r' y' R' U R == 2-8-4,1-9-3"]},
  { id: 14, desc: 'Knight Move Shape', ollPattern: 'lbb.ttt.fft', algorithms: ["R' F R U R' F' R F U' F' == 2-6-8,1-3-7"]},
  { id: 15, desc: 'Knight Move Shape', ollPattern: 'tbr.ttt.lff', algorithms: ["l' U' l L' U' L U l' U l == 2-8-4,1+9,3+7"]},
  { id: 16, desc: 'Knight Move Shape', ollPattern: 'lbt.ttt.fft', algorithms: ["r U r' R U R' U' r U' r' == 1+9,3+7,2-8-6"]},
  { id: 17, desc: 'Dot', ollPattern: 'tbr.ltr.fft', algorithms: ["F R' F' R2 r' U R U' R' U' M' == 3+9,2-6-8-4", "L U L' U L' B L B' U2 L' B L B' == 1-9-7,2-4-6"]},
  { id: 18, desc: 'Dot', ollPattern: 'tbt.ltr.fff', algorithms: ["r U R' U R U2 r2 U' R U' R' U2 r == 2+4,6+8", "B U2 B2 R B R' U2 S' U B U' b' == 2+4,6+8,1+3,7+9"]},
  { id: 19, desc: 'Dot', ollPattern: 'tbt.ltr.lfr', algorithms: ["r' R U R U R' U' M' R' F R F' == 2-4-8-6,3+9"]},
  { id: 20, desc: 'Dot', ollPattern: 'tbt.ltr.tft', algorithms: ["r U R' U' M2 U R U' R' U' M' == 1-7-9-3,2-6-8-4", "r' R U R U R' U' M2 U R U' r' == 1-3-9-7,2-4-8-6"]},
  { id: 21, desc: 'Cross', ollPattern: 'btb.ttt.ftf', algorithms: ["R U2 R' U' R U R' U' R U' R' == 2-4-6", "B U B' U B U' B' U B U2 B' == 2-8-4"]},
  { id: 22, desc: 'Cross', ollPattern: 'ltb.ttt.ltf', algorithms: ["R U2 R2 U' R2 U' R2 U2 R == 1+9,3+7,2-4-8"]},
  { id: 23, desc: 'Cross', ollPattern: 'btb.ttt.ttt', algorithms: ["R2 D' R U2 R' D R U2 R == 1-9-3", "L2 D L' U2 L D' L' U2 L' == 1-3-7"]},
  { id: 24, desc: 'Cross', ollPattern: 'btt.ttt.ftt', algorithms: ["r U R' U' r' F R F' == 1-7-3", "B U B D B' U' B D' B2 == 1-7-3"]},
  { id: 25, desc: 'Cross', ollPattern: 'ltt.ttt.ttf', algorithms: ["F' r U R' U' r' F R == 1-9-3", "F' L F R' F' L' F R == 1-9-3"]},
  { id: 26, desc: 'Cross', ollPattern: 'ltt.ttt.ftr', algorithms: ["R U2 R' U' R U' R' == 1+9,3+7,2-4-6", "F' U' F U' F' U2 F == 1+9,3+7,2-8-4", "F' U B U' F U B' U' == 9-7-1"]},
  { id: 27, desc: 'Cross', ollPattern: 'btr.ttt.ttf', algorithms: ["R U R' U R U2 R' == 1+9,3+7,2-4-6", "F' U2 F U F' U F == 1+9,3+7,2-4-8", "R U' L' U R' U' L U == 1-9-3"]},
  { id: 28, desc: 'Corners Oriented', ollPattern: 'ttt.ttr.tft', algorithms: ["r U R' U' r' R U R U' R' == 2-6-8"]},
  { id: 29, desc: 'Awkward Shape', ollPattern: 'btt.ttr.fft', algorithms: ["R U R' U' R U' R' F' U' F R U R' == 1-9-7-3,6+8"]},
  { id: 30, desc: 'Awkward Shape', ollPattern: 'ltr.ttr.tft', algorithms: ["F R' F R2 U' R' U' R U R' F2 == 1-7-9-3,2-4-6-8", "F U R U2 R' U' R U2 R' U' F' == 1-9-3-7,2-6-8-4"]},
  { id: 31, desc: 'P Shape', ollPattern: 'btt.ltt.fft', algorithms: ["R' U' F U R U' R' F' R == 1+3,2+4"]},
  { id: 32, desc: 'P Shape', ollPattern: 'ttb.ttr.tff', algorithms: ["L U F' U' L' U L F L' == 1+3,2+6", "S' L U L' U' L' B L b' == 2-6-8,3-7-9"]},
  { id: 33, desc: 'T Shape', ollPattern: 'bbt.ttt.fft', algorithms: ["R U R' U' R' F R F' == 1-7-3,2-8-6"]},
  { id: 34, desc: 'C Shape', ollPattern: 'lbr.ttt.tft', algorithms: ["R U R2 U' R' F R U R U' F' == 1-3-7,2-8-6", "R U R' U' B' R' F R F' B == 1-3-7,2-8-6"]},
  { id: 35, desc: 'Fish Shape', ollPattern: 'tbr.ltt.ftt', algorithms: ["R U2 R2 F R F' R U2 R' == 1+7,3+9,2-6-4"]},
  { id: 36, desc: 'W Shape', ollPattern: 'ttb.ltt.lft', algorithms: ["L' U' L U' L' U L U L F' L' F == 2+4,6+8,3-7-9"]},
  { id: 37, desc: 'Fish Shape', ollPattern: 'ttr.ttr.fft', algorithms: ["F R' F' R U R U' R' == 1-3-7,2-4-6", "F R U' R' U' R U R' F' == 1-9-3-7,2-4-6-8"]},
  { id: 38, desc: 'W Shape', ollPattern: 'btt.ttr.tfr', algorithms: ["R U R' U R U' R' U' R' F R F' == 1-9-7,2+4,6+8"]},
  { id: 39, desc: 'Big Lightning Bolt', ollPattern: 'bbt.ttt.tfr',algorithms: ["L F' L' U' L U F U' L' == 1+3,2+6"]},
  { id: 40, desc: 'Big Lightning Bolt', ollPattern: 'tbb.ttt.lft',algorithms: ["R' F R U R' U' F' U R == 1+3,2+4"]},
  { id: 41, desc: 'Awkward Shape', ollPattern: 'btb.ttr.tft',algorithms: ["R U R' U R U2 R' F R U R' U' F' == 1+7,3+9,2+4,6+8"]},
  { id: 42, desc: 'Awkward Shape', ollPattern: 'tbt.ttr.ftf', algorithms: ["R' U' R U' R' U2 R F R U R' U' F' == 1+7,3+9,2-8-4"] },
  { id: 43, desc: 'P Shape', ollPattern: 'ltt.ltt.lft', algorithms: ["F' U' L' U L F == 1+3,7+9,2-4-8", "R' U' F R' F' R U R == 1+3,7+9,4-6-8"] },
  { id: 44, desc: 'P Shape', ollPattern: 'ttr.ttr.tfr', algorithms: ["F U R U' R' F' == 1+3,7+9,2-6-8", "b L U L' U' b' == 1+3,7+9,2-4-8"] },
  { id: 45, desc: 'T Shape', ollPattern: 'lbt.ttt.lft', algorithms: ["F R U R' U' F' == 1+3,7+9,2-8-6"] },
  { id: 46, desc: 'C Shape', ollPattern: 'ttr.ltr.ttr', algorithms: ["R' U' R' F R F' U R == 1+3,7+9,4-8-6"] },
  { id: 47, desc: 'Small L Shape', ollPattern: 'btr.ltt.ffr', algorithms: ["R' U' R' F R F' R' F R F' U R == 4-8-6", "F' L' U' L U L' U' L U F == 2-4-8", "L U F U' F' L' F U F' U F U2 F' == 1+3,7+9,2-8-4"] },
  { id: 48, desc: 'Small L Shape', ollPattern: 'ltb.ttr.lff', algorithms: ["F R U R' U' R U R' U' F' == 2-4-8"] },
  { id: 49, desc: 'Small L Shape', ollPattern: 'ltb.ltt.lff', algorithms: ["r U' r2 U r2 U r2 U' r == 1+9,3+7,2-8-4"] },
  { id: 50, desc: 'Small L Shape', ollPattern: 'lbb.ltt.ltf', algorithms: ["r' U r2 U' r2 U' r2 U r' == 1+9,3+7,2-4-8"] },
  { id: 51, desc: 'I Shape', ollPattern: 'bbr.ttt.ffr', algorithms: ["F U R U' R' U R U' R' F' == 2-8-6", "b L U L' U' L U L' U' b' == 2-8-6"] },
  { id: 52, desc: 'I Shape', ollPattern: 'btr.ltr.ftr', algorithms: ["R U R' U R U' B U' B' R' == 1+3,7+9", "L' B' U' B U' L U L' U L == 1+3,7+9", "R U R' U R U' y R U' R' F' == 1+3,7+9"] },
  { id: 53, desc: 'Small L Shape', ollPattern: 'btb.ltt.fff', algorithms: ["l' U2 L U L' U' L U L' U l == 4-6-8", "b' U' B U' B' U B U' B' U2 b == 2-8-6"] },
  { id: 54, desc: 'Small L Shape', ollPattern: 'btb.ttr.fff', algorithms: ["r U2 R' U' R U R' U' R U' r' == 4-6-8", "b U B' U B U' B' U B U2 b' == 2-8-4"] },
  { id: 55, desc: 'I Shape', ollPattern: 'bbb.ttt.fff', algorithms: ["R' F R U R U' R2 F' R2 U' R' U R U R' == 1-7-9-3,2-8-6-4", "B U2 B2 U' B U' B' U2 R B R' == 3-9-7,4-8-6"] },
  { id: 56, desc: 'I Shape', ollPattern: 'ltr.ttt.lfr', algorithms: ["r' U' r U' R' U R U' R' U R r' U r == 2-4-8", "r U r' U R U' R' U R U' R' r U' r' == 2-8-6", "r U r' U R U' R' U R U' M' U' r' == 2-8-6"] },
  { id: 57, desc: 'Corners Oriented', ollPattern: 'tbt.ttt.tft', algorithms: ["R U R' U' M' U R U' r' == 2-8-6"] },
] as const // @fon

const pllCases: PredefinedCaseRubikPll[] = [ // @fof
  { id: 1, desc: 'Aa Adjacent Corner Swap', arrows: '1-3-7', algorithms: ["x L2 D2 L' U' L D2 L' U L'", "z' B' U B' D2 B U' B' D2 B2"] },
  { id: 2, desc: 'Ab Adjacent Corner Swap', arrows: '1-7-9', algorithms: ["x' L2 D2 L U L' D2 L U' L", "z B U' B D2 B' U B D2 B2"] },
  { id: 3, desc: 'F Adjacent Corner Swap', arrows: '2+8,3+9', algorithms: ["R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R"] },
  { id: 4, desc: 'Ga Adjacent Corner Swap', arrows: '1-3-7,2-4-6', algorithms: ["R2 U R' U R' U' R U' R2 U' D R' U R D'", "R2 u R' U R' U' R u' R2 y' R' U R"] },
  { id: 5, desc: 'Gb Adjacent Corner Swap', arrows: '1-7-3,2-6-4', algorithms: ["R' U' R U D' R2 U R' U R U' R U' R2 D", "R' U' R B2 u B' U B U' B u' B2"] },
  { id: 6, desc: 'Gc Adjacent Corner Swap', arrows: '1-7-9,4-6-8', algorithms: ["L2 B2 L U2 L U2 L' B L U L' U' L' B L2", "R2 U' R U' R U R' U R2 U D' R U' R' D", "R2 u' R U' R U R' u R2 y R U' R'"] },
  { id: 7, desc: 'Gd Adjacent Corner Swap', arrows: '1-3-7,2-4-8', algorithms: ["R U R' U' D R2 U' R U' R' U R' U R2 D'", "R U R' y' R2 u' R U' R' U R' u R2"] },
  { id: 8, desc: 'Ja Adjacent Corner Swap', arrows: '2+6,3+9', algorithms: ["x R2 F R F' R U2 r' U r U2", "R' U' R B R' U' R U R B' R2 U R", "F' U B' U2 F U' F' U2 F B"] },
  { id: 9, desc: 'Jb Adjacent Corner Swap', arrows: '6+8,3+9', algorithms: ["R U R' F' R U R' U' R' F R2 U' R'"] },
  { id: 10, desc: 'Ra Adjacent Corner Swap', arrows: '2+4,3+9', algorithms: ["R U' R' U' R U R D R' U' R D' R' U2 R'", "R U R' F' R U2 R' U2 R' F R U R U2 R'", "B U2 B' U2 B L' B' U' B U B L B2"] },
  { id: 11, desc: 'Rb Adjacent Corner Swap', arrows: '4+8,3+9', algorithms: ["R2 F R U R U' R' F' R U2 R' U2 R", "F' U2 F U2 F' L F U F' U' F' L' F2", "R' U2 R' D' R U' R' D R U R U' R' U' R"] },
  { id: 12, desc: 'T Adjacent Corner Swap', arrows: '4+6,3+9', algorithms: ["R U R' U' R' F R2 U' R' U' R U R' F'"] },
  { id: 13, desc: 'E Diagonal Corner Swap', arrows: '1+7,3+9', algorithms: ["x' L' U L D' L' U' L D L' U' L D' L' U L D", "x' R U' R' D R U R' D' R U R' D R U' R' D'"] },
  { id: 14, desc: 'Na Diagonal Corner Swap', arrows: '3+7,4+6', algorithms: ["R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'", "z U R' D R2 U' R D' U R' D R2 U' R D'"] },
  { id: 15, desc: 'Nb Diagonal Corner Swap', arrows: '1+9,4+6', algorithms: ["R' U R U' R' F' U' F R U R' F R' F' R U' R", "z D' R U' R2 D R' U D' R U' R2 D R' U"] },
  { id: 16, desc: 'V Diagonal Corner Swap', arrows: '1+9,2+6', algorithms: ["R' U R' U' y R' F' R2 U' R' U R' F R F", "R' U R' U' R D' R' D R' U D' R2 U' R2 D R2", "R U2 R' D R U' R U' R U R2 D R' U' R D2", "z D' R2 D R2 U R' D' R U' R U R' D R U' z'", "x' R' F R F' U R U2 R' U' R U' R' U2 R U R' U'"] },
  { id: 17, desc: 'Y Diagonal Corner Swap', arrows: '1+9,2+4', algorithms: ["F R U' R' U' R U R' F' R U R' U' R' F R F'", "F R' F R2 U' R' U' R U R' F' R U R' U' F'"] },
  { id: 18, desc: 'H Edges Only', arrows: '2+8,4+6', algorithms: ["M2 U M2 U2 M2 U M2", "M2 U' M2 U2 M2 U' M2"] },
  { id: 19, desc: 'Ua Edges Only', arrows: '4-8-6', algorithms: ["M2 U M U2 M' U M2", "R U' R U R U R U' R' U' R2", "L2 U' L' U' L U L U L U' L"] },
  { id: 20, desc: 'Ub Edges Only', arrows: '4-6-8', algorithms: ["M2 U' M U2 M' U' M2", "R2 U R U R' U' R' U' R' U R'", "L' U L' U' L' U' L' U L U L2"] },
  { id: 21, desc: 'Z Edges Only', arrows: '2+6,4+8', algorithms: ["M' U M2 U M2 U M' U2 M2", "S' U' S2 U' S2 U' S' U2 S2", "S2 U S2 U S' U2 S2 U2 S'", "M2 U' M2 U' M' U2 M2 U2 M'"] },
] as const // @fon

export const knownOllIds: Record<string, PredefinedCaseRubikOll> = toRecord('oll', ollCases)
export const knownPllIds: Record<string, PredefinedCaseRubikPll> = toRecord('pll', pllCases)
