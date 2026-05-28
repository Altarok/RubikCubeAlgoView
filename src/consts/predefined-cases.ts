type ollPatternLine1 = `${'t' | 'b' | 'l'}${'t' | 'b'}${'t' | 'b' | 'r'}`
type ollPatternLine2 = `${'t' | 'l'}t${'t' | 'r'}`
type ollPatternLine3 = `${'t' | 'f' | 'l'}${'t' | 'f'}${'t' | 'f' | 'r'}`
type ollPattern = `${ollPatternLine1}.${ollPatternLine2}.${ollPatternLine3}`

export interface PredefinedCase {
  id: string // distinct values
  desc: string
}

export interface PredefinedCaseRubikOll extends PredefinedCase {
  ollPattern: ollPattern
  algorithms: string []
}

export interface PredefinedCaseRubikPll extends PredefinedCase {
  arrows: string
  algorithms: string []
}

export const knownOllIds: Record<string, PredefinedCaseRubikOll> = {
  'oll-1': {
    id: 'oll-1', desc: 'Dot', ollPattern: 'lbr.ltr.lfr',
    algorithms: ["R U2 R2 F R F' U2 R' F R F' == 2+4,6+8,3-7,7-9,9-3"]
  },
  'oll-2': {
    id: 'oll-2', desc: 'Dot', ollPattern: 'bbb.ltr.lfr',
    algorithms: ["r U r' U2 r U2 R' U2 R U' r' == 2+4,6+8,1+9,3+7", "L F U F' U' L' l F U F' U' l' == 2+6,4+8", "L F U F' U' M F U F' U' l' == 2+6,4+8"]
  },
  'oll-3': {
    id: 'oll-3', desc: 'Dot', ollPattern: 'bbr.ltr.tff',
    algorithms: ["r' R2 U R' U r U2 r' U M' == 2-6-8-4,1-7-9-3", "R U B U' B' R' U R B U B' U' R' == 2-8-6-4,1-7-9-3", "l F U F' U' l' U' L F U F' U' L' == 1-3-9-7,4+8"]
  },
  'oll-4': {
    id: 'oll-4', desc: 'Dot', ollPattern: 'lbb.ltr.fft',
    algorithms: ["M U' r U2 r' U' R U' R' M' == 1-3-9-7,2-4-8-6", "R U B U' B' R' U' R B U B' U' R' == 1-3-9-7,2-4-6-8", "l F U F' U' l' U L F U F' U' L' == 1-7-9-3,2+6"]
  },
  'oll-5': {
    id: 'oll-5', desc: 'Square Shape', ollPattern: 'ttr.ttr.lff',
    algorithms: ["l' U2 L U L' U l == 1+9,3+7,4-6-8"]
  },
  'oll-6': {
    id: 'oll-6', desc: 'Square Shape', ollPattern: 'ltt.ltt.fft',
    algorithms: ["r U2 R' U' R U' r' == 1+9,3+7,4-8-6"]
  },
  'oll-7': {
    id: 'oll-7', desc: 'Small Lightning Bolt', ollPattern: 'btr.ttr.tff',
    algorithms: ["r U R' U R U2 r' == 1+9,3+7,4-6-8"]
  },
  'oll-8': {
    id: 'oll-8', desc: 'Small Lightning Bolt', ollPattern: 'ltb.ltt.fft',
    algorithms: ["l' U' L U' L' U2 l == 1+9,3+7,4-8-6", "R U2 R' U2 R' F R F' == 1-9-7,4-8-6"]
  },
  'oll-9': {
    id: 'oll-9', desc: 'Fish Shape', ollPattern: 'ltb.ttr.fft',
    algorithms: ["R U R' U' R' F R2 U R' U' F' == 1-9-7,2-6-8"]
  },
  'oll-10': {
    id: 'oll-10', desc: 'Fish Shape', ollPattern: 'bbt.ttr.ltf',
    algorithms: ["R U R' U R' F R F' R U2 R' == 1+3,7+9", "l U L' U L U' L' U' l' L U L U' L' == 1+9,3+7,2+6,4+8"]
  },
  'oll-11': {
    id: 'oll-11', desc: 'Small Lightning Bolt', ollPattern: 'btt.ttr.lff',
    algorithms: ["r U R' U R' F R F' R U2 r' == 1+3,7+9", "l' L2 U L' U L U2 L' U M == 1-7-9-3,6+8"]
  },
  'oll-12': {
    id: 'oll-12', desc: 'Small Lightning Bolt', ollPattern: 'ttb.ltt.ffr',
    algorithms: ["M' R' U' R U' R' U2 R U' R r' == 1-3-9-7,4+8"]
  },
  'oll-13': {
    id: 'oll-13', desc: 'Knight Move Shape', ollPattern: 'bbr.ttt.tff',
    algorithms: ["F U R U' R2 F' R U R U' R' == 2-8-6,1-7-9", "r U' r' U' r U r' y' R' U R == 2-8-4,1-9-3"]
  },
  'oll-14': {
    id: 'oll-14', desc: 'Knight Move Shape', ollPattern: 'lbb.ttt.fft',
    algorithms: ["R' F R U R' F' R F U' F' == 2-6-8,1-3-7"]
  },
  'oll-15': {
    id: 'oll-15', desc: 'Knight Move Shape', ollPattern: 'tbr.ttt.lff',
    algorithms: ["l' U' l L' U' L U l' U l == 2-8-4,1+9,3+7"]
  },
  'oll-16': {
    id: 'oll-16', desc: 'Knight Move Shape', ollPattern: 'lbt.ttt.fft',
    algorithms: ["r U r' R U R' U' r U' r' == 1+9,3+7,2-8-6"]
  },
  'oll-17': {
    id: 'oll-17', desc: 'Dot', ollPattern: 'tbr.ltr.fft',
    algorithms: ["F R' F' R2 r' U R U' R' U' M' == 3+9,2-6-8-4", "L U L' U L' B L B' U2 L' B L B' == 1-9-7,2-4-6"]
  },
  'oll-18': {
    id: 'oll-18', desc: 'Dot', ollPattern: 'tbt.ltr.fff',
    algorithms: ["r U R' U R U2 r2 U' R U' R' U2 r == 2+4,6+8", "B U2 B2 R B R' U2 S' U B U' b' == 2+4,6+8,1+3,7+9"]
  },
  'oll-19': {
    id: 'oll-19', desc: 'Dot', ollPattern: 'tbt.ltr.lfr',
    algorithms: ["r' R U R U R' U' M' R' F R F' == 2-4-8-6,3+9"]
  },
  'oll-20': {
    id: 'oll-20', desc: 'Dot', ollPattern: 'tbt.ltr.tft',
    algorithms: ["r U R' U' M2 U R U' R' U' M' == 1-7-9-3,2-6-8-4", "r' R U R U R' U' M2 U R U' r' == 1-3-9-7,2-4-8-6"]
  },
  'oll-21': {
    id: 'oll-21', desc: 'Cross', ollPattern: 'btb.ttt.ftf',
    algorithms: ["R U2 R' U' R U R' U' R U' R' == 2-4-6", "B U B' U B U' B' U B U2 B' == 2-8-4"]
  },
  'oll-22': {
    id: 'oll-22', desc: 'Cross', ollPattern: 'ltb.ttt.ltf',
    algorithms: ["R U2 R2 U' R2 U' R2 U2 R == 1+9,3+7,2-4-8"]
  },
  'oll-23': {
    id: 'oll-23', desc: 'Cross', ollPattern: 'btb.ttt.ttt',
    algorithms: ["R2 D' R U2 R' D R U2 R == 1-9-3", "L2 D L' U2 L D' L' U2 L' == 1-3-7"]
  },
  'oll-24': {
    id: 'oll-24', desc: 'Cross', ollPattern: 'btt.ttt.ftt',
    algorithms: ["r U R' U' r' F R F' == 1-7-3", "B U B D B' U' B D' B2 == 1-7-3"]
  },
  'oll-25': {
    id: 'oll-25', desc: 'Cross', ollPattern: 'ltt.ttt.ttf',
    algorithms: ["F' r U R' U' r' F R == 1-9-3", "F' L F R' F' L' F R == 1-9-3"]
  },
  'oll-26': {
    id: 'oll-26', desc: 'Cross', ollPattern: 'ltt.ttt.ftr',
    algorithms: ["R U2 R' U' R U' R' == 1+9,3+7,2-4-6", "F' U' F U' F' U2 F == 1+9,3+7,2-8-4", "F' U B U' F U B' U' == 9-7-1"]
  },
  'oll-27': {
    id: 'oll-27', desc: 'Cross', ollPattern: 'btr.ttt.ttf',
    algorithms: ["R U R' U R U2 R' == 1+9,3+7,2-4-6", "F' U2 F U F' U F == 1+9,3+7,2-4-8", "R U' L' U R' U' L U == 1-9-3"]
  },
  'oll-28': {
    id: 'oll-28', desc: 'Corners Oriented', ollPattern: 'ttt.ttr.tft',
    algorithms: ["r U R' U' r' R U R U' R' == 2-6-8"]
  },
  'oll-29': {
    id: 'oll-29', desc: 'Awkward Shape', ollPattern: 'btt.ttr.fft',
    algorithms: ["R U R' U' R U' R' F' U' F R U R' == 1-9-7-3,6+8"]
  },
  'oll-30': {
    id: 'oll-30', desc: 'Awkward Shape', ollPattern: 'ltr.ttr.tft',
    algorithms: ["F R' F R2 U' R' U' R U R' F2 == 1-7-9-3,2-4-6-8", "F U R U2 R' U' R U2 R' U' F' == 1-9-3-7,2-6-8-4"]
  },
  'oll-31': {
    id: 'oll-31', desc: 'P Shape', ollPattern: 'btt.ltt.fft',
    algorithms: ["R' U' F U R U' R' F' R == 1+3,2+4"]
  },
  'oll-32': {
    id: 'oll-32', desc: 'P Shape', ollPattern: 'ttb.ttr.tff',
    algorithms: ["L U F' U' L' U L F L' == 1+3,2+6", "S' L U L' U' L' B L b' == 2-6-8,3-7-9"]
  },
  'oll-33': {
    id: 'oll-33', desc: 'T Shape', ollPattern: 'bbt.ttt.fft',
    algorithms: ["R U R' U' R' F R F' == 1-7-3,2-8-6"]
  },
  'oll-34': {
    id: 'oll-34', desc: 'C Shape', ollPattern: 'lbr.ttt.tft',
    algorithms: ["R U R2 U' R' F R U R U' F' == 1-3-7,2-8-6", "R U R' U' B' R' F R F' B == 1-3-7,2-8-6"]
  },
  'oll-35': {
    id: 'oll-35', desc: 'Fish Shape', ollPattern: 'tbr.ltt.ftt',
    algorithms: ["R U2 R2 F R F' R U2 R' == 1+7,3+9,2-6-4"]
  },
  'oll-36': {
    id: 'oll-36', desc: 'W Shape', ollPattern: 'ttb.ltt.lft',
    algorithms: ["L' U' L U' L' U L U L F' L' F == 2+4,6+8,3-7-9"]
  },
  'oll-37': {
    id: 'oll-37', desc: 'Fish Shape', ollPattern: 'ttr.ttr.fft',
    algorithms: ["F R' F' R U R U' R' == 1-3-7,2-4-6", "F R U' R' U' R U R' F' == 1-9-3-7,2-4-6-8"]
  },
  'oll-38': {
    id: 'oll-38', desc: 'W Shape', ollPattern: 'btt.ttr.tfr',
    algorithms: ["R U R' U R U' R' U' R' F R F' == 1-9-7,2+4,6+8"]
  },
  'oll-39': {
    id: 'oll-39', desc: 'Big Lightning Bolt', ollPattern: 'bbt.ttt.tfr',
    algorithms: ["L F' L' U' L U F U' L' == 1+3,2+6"]
  },
  'oll-40': {
    id: 'oll-40', desc: 'Big Lightning Bolt', ollPattern: 'tbb.ttt.lft',
    algorithms: ["R' F R U R' U' F' U R == 1+3,2+4"]
  },
  'oll-41': {
    id: 'oll-41', desc: 'Awkward Shape', ollPattern: 'btb.ttr.tft',
    algorithms: ["R U R' U R U2 R' F R U R' U' F' == 1+7,3+9,2+4,6+8"]
  },
  'oll-42': {
    id: 'oll-42', desc: 'Awkward Shape', ollPattern: 'tbt.ttr.ftf',
    algorithms: ["R' U' R U' R' U2 R F R U R' U' F' == 1+7,3+9,2-8-4"]
  },
  'oll-43': {
    id: 'oll-43', desc: 'P Shape', ollPattern: 'ltt.ltt.lft',
    algorithms: ["F' U' L' U L F == 1+3,7+9,2-4-8", "R' U' F R' F' R U R == 1+3,7+9,4-6-8"]
  },
  'oll-44': {
    id: 'oll-44', desc: 'P Shape', ollPattern: 'ttr.ttr.tfr',
    algorithms: ["F U R U' R' F' == 1+3,7+9,2-6-8", "b L U L' U' b' == 1+3,7+9,2-4-8"]
  },
  'oll-45': {id: 'oll-45', desc: 'T Shape', ollPattern: 'lbt.ttt.lft', algorithms: ["F R U R' U' F' == 1+3,7+9,2-8-6"]},
  'oll-46': {
    id: 'oll-46', desc: 'C Shape', ollPattern: 'ttr.ltr.ttr',
    algorithms: ["R' U' R' F R F' U R == 1+3,7+9,4-8-6"]
  },
  'oll-47': {
    id: 'oll-47', desc: 'Small L Shape', ollPattern: 'btr.ltt.ffr',
    algorithms: ["R' U' R' F R F' R' F R F' U R == 4-8-6", "F' L' U' L U L' U' L U F == 2-4-8", "L U F U' F' L' F U F' U F U2 F' == 1+3,7+9,2-8-4"]
  },
  'oll-48': {
    id: 'oll-48', desc: 'Small L Shape', ollPattern: 'ltb.ttr.lff',
    algorithms: ["F R U R' U' R U R' U' F' == 2-4-8"]
  },
  'oll-49': {
    id: 'oll-49', desc: 'Small L Shape', ollPattern: 'ltb.ltt.lff',
    algorithms: ["r U' r2 U r2 U r2 U' r == 1+9,3+7,2-8-4"]
  },
  'oll-50': {
    id: 'oll-50', desc: 'Small L Shape', ollPattern: 'lbb.ltt.ltf',
    algorithms: ["r' U r2 U' r2 U' r2 U r' == 1+9,3+7,2-4-8"]
  },
  'oll-51': {
    id: 'oll-51', desc: 'I Shape', ollPattern: 'bbr.ttt.ffr',
    algorithms: ["F U R U' R' U R U' R' F' == 2-8-6", "b L U L' U' L U L' U' b' == 2-8-6"]
  },
  'oll-52': {
    id: 'oll-52', desc: 'I Shape', ollPattern: 'btr.ltr.ftr',
    algorithms: ["R U R' U R U' B U' B' R' == 1+3,7+9", "L' B' U' B U' L U L' U L == 1+3,7+9", "R U R' U R U' y R U' R' F' == 1+3,7+9"]
  },
  'oll-53': {
    id: 'oll-53', desc: 'Small L Shape', ollPattern: 'btb.ltt.fff',
    algorithms: ["l' U2 L U L' U' L U L' U l == 4-6-8", "b' U' B U' B' U B U' B' U2 b == 2-8-6"]
  },
  'oll-54': {
    id: 'oll-54', desc: 'Small L Shape', ollPattern: 'btb.ttr.fff',
    algorithms: ["r U2 R' U' R U R' U' R U' r' == 4-6-8", "b U B' U B U' B' U B U2 b' == 2-8-4"]
  },
  'oll-55': {
    id: 'oll-55', desc: 'I Shape', ollPattern: 'bbb.ttt.fff',
    algorithms: ["R' F R U R U' R2 F' R2 U' R' U R U R' == 1-7-9-3,2-8-6-4", "B U2 B2 U' B U' B' U2 R B R' == 3-9-7,4-8-6"]
  },
  'oll-56': {
    id: 'oll-56', desc: 'I Shape', ollPattern: 'ltr.ttt.lfr',
    algorithms: ["r' U' r U' R' U R U' R' U R r' U r == 2-4-8", "r U r' U R U' R' U R U' R' r U' r' == 2-8-6", "r U r' U R U' R' U R U' M' U' r' == 2-8-6"]
  },
  'oll-57': {
    id: 'oll-57', desc: 'Corners Oriented', ollPattern: 'tbt.ttt.tft',
    algorithms: ["R U R' U' M' U R U' r' == 2-8-6"]
  },
}

export const knownPllIds: Record<string, PredefinedCaseRubikPll> = {
  'pll-Aa': {
    id: 'pll-Aa',
    desc: 'TODO',
    arrows: '1-3-7',
    algorithms: ["x L2 D2 L' U' L D2 L' U L'", "z' B' U B' D2 B U' B' D2 B2"]
  },


}
