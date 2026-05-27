import {MarkdownPostProcessorContext, MarkdownRenderChild} from 'obsidian'
import RubikCubeAlgos from './main'
import {DNF, Solve, SpeedcubeTimesCalculator, SpeedcubeTimesStatistics} from './model/speedcubing-statistics'
import {drawSpeedCubingResultsTable} from './view/speedcubing-results-table'

const DidNotFinish: Solve = {isDNF: true, time: undefined, isPB: false}


/**
 * Speedcubing results
 */
export default class SpeedCubingResultTableRenderChild extends MarkdownRenderChild {
  content: string[]
  solves: Solve[] = []
  pbSolve?: Solve = undefined

  constructor(readonly source: string, readonly plugin: RubikCubeAlgos, readonly container: HTMLElement, readonly ctx: MarkdownPostProcessorContext) {
    super(container)
    this.content = source.split('\n').filter(Boolean)
    this.collectData()
    const statistics: SpeedcubeTimesStatistics = this.createStatistics()
    drawSpeedCubingResultsTable(this.container, statistics)
  }

  createStatistics(): SpeedcubeTimesStatistics {
    return new SpeedcubeTimesCalculator(this.solves, this.pbSolve).run()
  }

  collectData() {
    if (!this.content || this.content.length < 1) {
      return
    }
    for (const line of this.content) {
      let timeTakenStr = line.replace(/s? \(.*\)$/g, '')

      if (timeTakenStr && /^\d+\.\d{3}/.test(timeTakenStr)) {
        this.solves.push(this.createSolve(timeTakenStr))
      } else if (timeTakenStr && /^pb:\d+\.\d{3}/.test(timeTakenStr)) {
        this.pbSolve = this.createPbSolve(timeTakenStr.replace('pb:', ''))
      } else if (timeTakenStr === DNF) {
        this.solves.push(DidNotFinish)
      } else {
        throw new Error('Illegal time measurement: ' + timeTakenStr)
      }
    }
  }

  private createSolve(timeTaken: string) {
    return {isDNF: false, time: +timeTaken, isPB: false}
  }

  private createPbSolve(timeTaken: string) {
    return {isDNF: false, time: +timeTaken, isPB: true}
  }
}

