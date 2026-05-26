type ollPatternLine1 = `${'t' | 'b' | 'l'}${'t' | 'b'}${'t' | 'b' | 'r'}`
type ollPatternLine2 = `${'t' | 'l'}t${'t' | 'r'}`
type ollPatternLine3 = `${'t' | 'f' | 'l'}${'t' | 'f'}${'t' | 'f' | 'r'}`
type ollPattern = `${ollPatternLine1}.${ollPatternLine2}.${ollPatternLine3}`

export interface PredefinedCase {
  id: string
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
  'oll-1': {id: 'oll-1', ollPattern: 'lbr.ltr.lfr', algorithms: ["R U2 R2 F R F' U2 R' F R F' == 2+4,6+8,3-7,7-9,9-3"]},
  /*
   * TODO fill rest of this with life
   */
  'oll-2': {id: 'oll-2', ollPattern: 'bbb.ltr.lfr', algorithms: []},
  'oll-3': {id: 'oll-3', ollPattern: 'bbr.ltr.tff', algorithms: []},
  'oll-4': {id: 'oll-4', ollPattern: 'lbb.ltr.fft', algorithms: []},
  'oll-5': {id: 'oll-5', ollPattern: 'ttr.ttr.lff', algorithms: []},
  'oll-6': {id: 'oll-6', ollPattern: 'ltt.ltt.fft', algorithms: []},
  'oll-7': {id: 'oll-7', ollPattern: 'btr.ttr.tff', algorithms: []},
  'oll-8': {id: 'oll-8', ollPattern: 'ltb.ltt.fft', algorithms: []},
  'oll-9': {id: 'oll-9', ollPattern: 'ltb.ttr.fft', algorithms: []},
  'oll-10': {id: 'oll-10', ollPattern: 'bbt.ttr.ltf', algorithms: []},
  'oll-11': {id: 'oll-11', ollPattern: 'btt.ttr.lff', algorithms: []},
  'oll-12': {id: 'oll-12', ollPattern: 'ttb.ltt.ffr', algorithms: []},
  'oll-13': {id: 'oll-13', ollPattern: 'bbr.ttt.tff', algorithms: []},
  'oll-14': {id: 'oll-14', ollPattern: 'lbb.ttt.fft', algorithms: []},
  'oll-15': {id: 'oll-15', ollPattern: 'tbr.ttt.lff', algorithms: []},
  'oll-16': {id: 'oll-16', ollPattern: 'lbt.ttt.fft', algorithms: []},
  'oll-17': {id: 'oll-17', ollPattern: 'tbr.ltr.fft', algorithms: []},
  'oll-18': {id: 'oll-18', ollPattern: 'tbt.ltr.fff', algorithms: []},
  'oll-19': {id: 'oll-19', ollPattern: 'tbt.ltr.lfr', algorithms: []},
  'oll-20': {id: 'oll-20', ollPattern: 'tbt.ltr.tft', algorithms: []},
  'oll-21': {id: 'oll-21', ollPattern: 'btb.ttt.ftf', algorithms: []},
  'oll-22': {id: 'oll-22', ollPattern: 'ltb.ttt.ltf', algorithms: []},
  'oll-23': {id: 'oll-23', ollPattern: 'btb.ttt.ttt', algorithms: []},
  'oll-24': {id: 'oll-24', ollPattern: 'btt.ttt.ftt', algorithms: []},
  'oll-25': {id: 'oll-25', ollPattern: 'ltt.ttt.ttf', algorithms: []},
  'oll-26': {id: 'oll-26', ollPattern: 'ltt.ttt.ftr', algorithms: []},
  'oll-27': {id: 'oll-27', ollPattern: 'btr.ttt.ttf', algorithms: []},
  'oll-28': {id: 'oll-28', ollPattern: 'ttt.ttr.tft', algorithms: []},
  'oll-29': {id: 'oll-29', ollPattern: 'btt.ttr.fft', algorithms: []},
  'oll-30': {id: 'oll-30', ollPattern: 'ltr.ttr.tft', algorithms: []},
  'oll-31': {id: 'oll-31', ollPattern: 'btt.ltt.fft', algorithms: []},
  'oll-32': {id: 'oll-32', ollPattern: 'ttb.ttr.tff', algorithms: []},
  'oll-33': {id: 'oll-33', ollPattern: 'bbt.ttt.fft', algorithms: []},
  'oll-34': {id: 'oll-34', ollPattern: 'lbr.ttt.tft', algorithms: []},
  'oll-35': {id: 'oll-35', ollPattern: 'tbr.ltt.ftt', algorithms: []},
  'oll-36': {id: 'oll-36', ollPattern: 'ttb.ltt.lft', algorithms: []},
  'oll-37': {id: 'oll-37', ollPattern: 'ttr.ttr.fft', algorithms: []},
  'oll-38': {id: 'oll-38', ollPattern: 'btt.ttr.tfr', algorithms: []},
  'oll-39': {id: 'oll-39', ollPattern: 'bbt.ttt.tfr', algorithms: []},
  'oll-40': {id: 'oll-40', ollPattern: 'tbb.ttt.lft', algorithms: []},
  'oll-41': {id: 'oll-41', ollPattern: 'btb.ttr.tft', algorithms: []},
  'oll-42': {id: 'oll-42', ollPattern: 'tbt.ttr.ftf', algorithms: []},
  'oll-43': {id: 'oll-43', ollPattern: 'ltt.ltt.lft', algorithms: []},
  'oll-44': {id: 'oll-44', ollPattern: 'ttr.ttr.tfr', algorithms: []},
  'oll-45': {id: 'oll-45', ollPattern: 'lbt.ttt.lft', algorithms: []},
  'oll-46': {id: 'oll-46', ollPattern: 'ttr.ltr.ttr', algorithms: []},
  'oll-47': {id: 'oll-47', ollPattern: 'btr.ltt.ffr', algorithms: []},
  'oll-48': {id: 'oll-48', ollPattern: 'ltb.ttr.lff', algorithms: []},
  'oll-49': {id: 'oll-49', ollPattern: 'ltb.ltt.lff', algorithms: []},
  'oll-50': {id: 'oll-50', ollPattern: 'lbb.ltt.ltf', algorithms: []},
  'oll-51': {id: 'oll-51', ollPattern: 'bbr.ttt.ffr', algorithms: []},
  'oll-52': {id: 'oll-52', ollPattern: 'btr.ltr.ftr', algorithms: []},
  'oll-53': {id: 'oll-53', ollPattern: 'btb.ltt.fff', algorithms: []},
  'oll-54': {id: 'oll-54', ollPattern: 'btb.ttr.fff', algorithms: []},
  'oll-55': {id: 'oll-55', ollPattern: 'bbb.ttt.fff', algorithms: []},
  'oll-56': {id: 'oll-56', ollPattern: 'ltr.ttt.lfr', algorithms: []},
  'oll-57': {id: 'oll-57', ollPattern: 'tbt.ttt.tft', algorithms: []},
}

export const knownPllIds: Record<string, PredefinedCaseRubikPll> = {
  // 'oll-1': {id: 'oll-1', ollPattern: 'lbr.ltr.lfr', algorithms: ['R U2 R2 F R F' U2 R' F R F' == 2+4,6+8,3-7,7-9,9-3']},
  'pll-Aa': {id: 'pll-Aa', arrows: '1-3-7', algorithms: ["x L2 D2 L' U' L D2 L' U L'", "z' B' U B' D2 B U' B' D2 B2"]},


}
