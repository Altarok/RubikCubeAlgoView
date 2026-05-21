export const DNF: string = 'DNF' as const
export const N_A: string = 'N/A' as const
export type Solve = number | typeof DNF
export type Result = Solve | typeof N_A

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

  constructor(public readonly count: number) {
  }
}

export class SpeedcubeTimesCalculator {
  result: CalculationResult

  constructor(private readonly data: Solve[]) {
    this.result = new CalculationResult(data.length)
  }

  run(): SpeedcubeTimesStatistics {
    if (this.result.count === 0) return this.result

    this.result.best = 1e6
    this.result.worst = 0

    let currentValues: Solve[] = []
    let dnfs: number = 0

    let runs = Math.min(this.data.length, 100)

    for (let i = 0; i < runs; i++) {
      const solve: Solve = this.data[i]!
      currentValues.push(solve)

      if (solve === DNF) {
        dnfs++
      } else {
        if ((solve as number) < this.result.best) this.result.best = solve as number
        if ((solve as number) > this.result.worst) this.result.worst = solve as number
      }

      if (i === 3) this.calculateMeanOf3(dnfs, currentValues)
      if (i === 5) this.calculateAverageOf5(dnfs, currentValues)
      if (i === 12) this.calculateAverageOf12(dnfs, currentValues)

    }

    this.calculateGlobalValues(currentValues)

    this.result.personalBest = this.result.best
    return this.result
  }


  calculateMeanOf3(dnfs: number, solves: Solve[]) {
    if (dnfs > 0) this.result.Mo3 = DNF
    else {
      this.result.Mo3 = 0
      for (const solve of solves) {
        this.result.Mo3 += (solve as number / 3)
      }
    }
  }

  calculateAverageOf5(dnfs: number, solves: Solve[]) {
    if (dnfs > 1) this.result.Ao5 = DNF
    else {
      let sortedSolves: Solve[] = this.sort(solves)
      this.result.Ao5 = 0
      for (let i = 1; i < solves.length - 1; i++) {
        this.result.Ao5 += (sortedSolves[i] as number / 3)
      }
    }
  }

  calculateAverageOf12(dnfs: number, solves: Solve[]) {
    if (dnfs > 1) this.result.Ao12 = DNF
    else {
      let sortedSolves: Solve[] = this.sort(solves)
      this.result.Ao12 = 0
      for (let i = 1; i < solves.length - 1; i++) {
        this.result.Ao12 += (sortedSolves[i] as number / 10)
      }
    }
  }

  calculateGlobalValues(solves: Solve[]) {
    let nonDnfs: number = 0
    let sum: number = 0
    for (let solve of solves) {
      if (solve !== DNF) {
        nonDnfs++;
        sum = sum + (solve as number);
      }
    }

    this.result.globalMean = sum / nonDnfs

    let sumOfDeviations: number = 0

    for (let solve of solves) {
      if (solve !== DNF) {
        sumOfDeviations = sumOfDeviations  + Math.abs((solve as number) - this.result.globalMean)
      }
    }

    this.result.standardDeviation = sumOfDeviations / nonDnfs
  }


  sort(solves: Solve[]) {
    return [...solves].sort((a, b) => {
      if (a === DNF) {
        if (b === DNF) {
          return 0
        } else {
          return 1
        }
      } else if (b === DNF) {
        return -1
      }
      return (a as number) - (b as number)
    });

  }

}
