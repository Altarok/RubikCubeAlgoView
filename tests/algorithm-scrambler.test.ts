import {beforeAll, beforeEach, describe, expect, it} from "vitest"
import {generateScramble} from "../src/training/algorithm-scrambler"

const scrambles : string[] = []

const faces = ['U', 'D', 'R', 'L', 'F', 'B']
const consecutiveStepsPattern = new RegExp(".*([UDRLFB])(|'|2) \\1.*")
const consecutiveRedundantAxisPattern = new RegExp(".*(R)(|'|2) L(|'|2) \\1.*")

const scrambleCountToTest = 100

beforeAll(() => {
  for (let i = 0; i < scrambleCountToTest; i++) {
    scrambles.push(generateScramble())
  }
})

describe('Algorithm scrambles', () => {

  it('should not have two consecutive steps of the same rotation', () => {
    scrambles.forEach(scramble => {
      expect(scramble).not.toMatch(consecutiveStepsPattern)
    })
  })

  it('should not have three consecutive steps with redundant axis rotation (R > L > R)', () => {
    scrambles.forEach(scramble => {
      expect(scramble).not.toMatch(/.*R(|'|2) L(|'|2) R.*/)
      expect(scramble).not.toMatch(/.*L(|'|2) R(|'|2) L.*/)

      expect(scramble).not.toMatch(/.*F(|'|2) B(|'|2) F.*/)
      expect(scramble).not.toMatch(/.*B(|'|2) F(|'|2) B.*/)

      expect(scramble).not.toMatch(/.*U(|'|2) D(|'|2) U.*/)
      expect(scramble).not.toMatch(/.*D(|'|2) U(|'|2) D.*/)
    })
  })

})
