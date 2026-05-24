export interface Solve {
  isDNF: boolean
  time: number | undefined
  isPB: boolean
}

export const N_A: string = 'N/A' as const
export const DNF: string = 'DNF' as const
const resultTypes: string[] = [N_A, DNF] as const
export type  Result = number | (typeof resultTypes)[number]

export interface SpeedcubeTimesStatistics {
  /* Personal best */
  personalBest: Result
  /* Single best, of session */
  best: Result
  /* Single worst, of session */
  worst: Result
  /* Total Result of completed solves in the active session */
  count: number
  /* Mean of 5, drop highest and  lowest */
  Ao5: Result
  /* Mean of 12, drop highest and  lowest */
  Ao12: Result
  /* Mean of 3, drop nothing */
  Mo3: Result
  /* The straight mathematical average of every single solve in the session, without dropping outliers. */
  globalMean: Result
  /* For consistency measuring. */
  standardDeviation: Result
}

class CalculationResult implements SpeedcubeTimesStatistics {
  personalBest: Result = N_A
  best: Result = N_A
  worst: Result = N_A
  Ao5: Result = N_A
  Ao12: Result = N_A
  Mo3: Result = N_A
  globalMean: Result = N_A
  standardDeviation: Result = N_A

  constructor(public count: number) {
  }
}

export class SpeedcubeTimesCalculator {
  result: SpeedcubeTimesStatistics

  constructor(private readonly data: Solve[], private readonly pbSolve?: Solve) {
    this.result = new CalculationResult(data.length)
  }

  run(): SpeedcubeTimesStatistics {
    if (this.pbSolve) this.result.personalBest = this.pbSolve.time!
    if (this.result.count === 0) return this.result

    this.result.best = 1e6
    this.result.worst = 0

    let currentValues: Solve[] = []
    let dnfCount: number = 0

    let runs = Math.min(this.data.length, 100)

    for (let i = 0; i < runs; i++) {
      const solve: Solve = this.data[i]!
      currentValues.push(solve)

      if (solve.isDNF) {
        dnfCount++
      } else {
        if (solve.time && solve.time < this.result.best) this.result.best = solve.time
        if (solve.time && solve.time > this.result.worst) this.result.worst = solve.time
      }

      if (i === 2) this.calculateMeanOf3(dnfCount, currentValues)
      if (i === 4) this.calculateAverageOf5(dnfCount, currentValues)
      if (i === 11) this.calculateAverageOf12(dnfCount, currentValues)

    }

    this.calculateGlobalValues(currentValues)

    if (this.result.personalBest === N_A) this.result.personalBest = this.result.best
    return this.result
  }


  calculateMeanOf3(dnfCount: number, solves: Solve[]) {
    if (dnfCount > 0) this.result.Mo3 = DNF
    else {
      this.result.Mo3 = 0
      for (const solve of solves) {
        this.result.Mo3 += solve.time! / 3
      }
    }
  }

  calculateAverageOf5(dnfCount: number, solves: Solve[]) {
    if (dnfCount > 1) this.result.Ao5 = DNF
    else {
      let sortedSolves: Solve[] = this.sort(solves)
      this.result.Ao5 = 0
      for (let i = 1; i < solves.length - 1; i++) {
        this.result.Ao5 += sortedSolves[i]!.time! / 3
      }
    }
  }

  calculateAverageOf12(dnfCount: number, solves: Solve[]) {
    if (dnfCount > 1) this.result.Ao12 = DNF
    else {
      let sortedSolves: Solve[] = this.sort(solves)
      this.result.Ao12 = 0
      for (let i = 1; i < solves.length - 1; i++) {
        this.result.Ao12 += sortedSolves[i]!.time! / 10
      }
    }
  }

  calculateGlobalValues(solves: Solve[]) {
    let nonDnfs: number = 0
    let sum: number = 0
    for (let solve of solves) {
      if (!solve.isDNF) {
        nonDnfs++
        sum = sum + solve.time!
      }
    }

    this.result.globalMean = sum / nonDnfs

    let sumOfDeviations: number = 0

    for (let solve of solves) {
      if (!solve.isDNF) {
        sumOfDeviations = sumOfDeviations + Math.abs(solve.time! - this.result.globalMean)
      }
    }

    this.result.standardDeviation = sumOfDeviations / nonDnfs
  }

  sort(solves: Solve[]) {
    return [...solves].sort((a, b) => {
      if (a.isDNF) {
        if (b.isDNF) {
          return 0
        } else {
          return 1
        }
      } else if (b.isDNF) {
        return -1
      }
      return a.time! - b.time!
    })
  }
}
