const modifiers = ['', "'", '2']
const faces = ['U', 'D', 'R', 'L', 'F', 'B']

/**
 * Return "" or "'" or "2"
 */
function getRandomModifier() {
  return modifiers[Math.floor(Math.random() * 3)]
}

/**
 * Scrambler Rules:
 * 1. The next move cannot be the exact same face as the last move (e.g., no R after R).
 * 2. If the last move and the next move are opposite faces on the same axis (like R then L), that is fine.
 * The catch: If the last two moves filled up both faces of an axis (e.g., the last two moves were R then L),
 * the third move cannot be from that same axis (R or L). It must switch to a new axis ($U, D, F,$ or $B$).
 */
export function generateScramble(): string {
  const scramble: string[] = []

  // Track the numerical index of the last two faces chosen
  let lastFace = -1
  let secondLastFace = -1

  while (scramble.length < 20) {
    const randomFaceIndex = Math.floor(Math.random() * 6) // 0 to 5

    /* Rule 1: Don't repeat the exact same face immediately */
    if (randomFaceIndex === lastFace) continue

    /* Rule 2 & 3: Check axis collision. Group axis: 0(U/D), 1(R/L), 2(F/B) */
    const currentAxis = Math.floor(randomFaceIndex / 2)
    const lastAxis = Math.floor(lastFace / 2)
    const secondLastAxis = Math.floor(secondLastFace / 2)

    if (currentAxis === lastAxis && currentAxis === secondLastAxis) {
      // Both faces of this axis were just used, skip to force an axis change
      continue
    }

    scramble.push(`${faces[randomFaceIndex]}${getRandomModifier()}`)

    // Shift our history trackers forward
    secondLastFace = lastFace
    lastFace = randomFaceIndex
  }

  return scramble.join(' ')
}
