import {MarkdownPostProcessorContext, MarkdownRenderChild} from 'obsidian'
import RubikCubeAlgos from "./main"
import {DNF, Solve, SpeedcubeTimesCalculator, SpeedcubeTimesStatistics} from "./model/speedcubing-statistics"
import {drawSpeedCubingResultsTable} from "./view/speedcubing-results-table"


/**
 * Speedcubing results
 */
export class SpeedCubingResultTableRenderChild extends MarkdownRenderChild {
  content: string[]
  times: Solve[]

  constructor(readonly source: string, readonly plugin: RubikCubeAlgos, readonly container: HTMLElement, readonly ctx: MarkdownPostProcessorContext) {
    super(container)
    this.content = source.split('\n').filter(Boolean)
    this.times = []
    this.collectData()
    const statistics: SpeedcubeTimesStatistics = this.createStatistics()
    drawSpeedCubingResultsTable(this.container, statistics)
  }

  createStatistics(): SpeedcubeTimesStatistics {
    return new SpeedcubeTimesCalculator(this.times).run()
  }

  collectData() {
    if (!this.content || this.content.length < 1) return
    for (const line of this.content) {
      let timeTakenStr = line.replace(/s? \(.*\)$/g, '')

      if (timeTakenStr && /\d+\.\d{3}/.test(timeTakenStr)) {
        let timeTaken: number = +timeTakenStr
        this.times.push(timeTaken)
      } else if (timeTakenStr === DNF) {
        this.times.push(DNF)
      } else {
        throw new Error('Illegal time measurement: ' + timeTakenStr)
      }
    }
  }

}
