import {MarkdownRenderChild, MarkdownRenderer} from 'obsidian'
import RubikCubeAlgos from '../main'
import {SectionHighlight} from '../settings/plugin-settings-tab'
import {Algorithm} from '../model/algorithms'


export class AlgorithmRenderer {
  constructor(readonly plugin: RubikCubeAlgos,
              readonly component: MarkdownRenderChild) {
  }

  private addText(text: string, container: HTMLElement) {
    void MarkdownRenderer.render(
      this.app,
      text,
      container,
      '',
      this.component)
  }


  /**
   * Renders a simple bullet point list of algorithms (used by PLL).
   */
  renderAlgorithmList(container: HTMLElement,
                      algorithms: Algorithm[]): void {
    if (algorithms.length === 0) return


    algorithms.forEach(item => {
      const ul: HTMLUListElement = container.createEl('ul')
      let li = ul.createEl('li')
      item.algorithmLabel = li.createEl('label')
      item.algorithmRenderer = this

      const markdown = item.toString()

      this.renderTextWithHighlights(markdown, item.algorithmLabel)
    })
  }

  renderTextWithHighlights(text: string,
                           container: HTMLElement): void {
    container.empty()
    const matches: { before: string; match: string; color: string, after: string }[] = this.findMatches(text)
    const matchesCount = matches.length

    if (matchesCount === 0) return

    matches.forEach((match: { before: string; match: string; color: string, after: string }, index: number) => {

      if (match.before) {
        const span = container.createSpan()
        this.addText(match.before, span)
      }
      if (match.match) {
        const span = container.createSpan({
          cls: 'rca-highlight'
          // ,
          // attr: {backgroundColor: match.color}
        })
        span.style.setProperty('background-color', match.color)
        this.addText(match.match, span)
      }
      if (index === matchesCount - 1 && match.after) {
        const span = container.createSpan()
        this.addText(match.after, span)
      }
    })
  }


  /**
   * Renders a list of algorithms with radio buttons for selection (used by OLL).
   */
  renderAlgorithmSelect(container: HTMLElement,
                        algorithms: Algorithm[],
                        selectedIndex: string,
                        uniqueIdForRadioButtons: string): void {
    const ul: HTMLUListElement = container.createEl('ul')
    const radioDiv = ul.createDiv({attr: {id: 'oll-radio-buttons-div'}})

    algorithms.forEach((item, i) => {
      const isChecked = selectedIndex === item.initialHash

      const uniqueId = item.initialHash

      radioDiv.createEl('input', { // create HTMLInputElement
        attr: {
          type: 'radio', // radio button
          name: uniqueIdForRadioButtons, // unique identifier for radio button grp
          id: uniqueId,
          value: i.toString(), // consts sent to the script ('backend') when the form is submitted
          ...(isChecked && {checked: true}) // only add checked attribute if true
        }
      })

      item.algorithmLabel = radioDiv.createEl('label', {
        cls: 'rubik-cube-algs-algorithms-list',
        attr: {
          for: uniqueId, // allows users to click the text to select the button
          id: 'forBtn' + uniqueId
        },
      })
      item.algorithmRenderer = this

      this.renderTextWithHighlights(item.toString(), item.algorithmLabel)

      radioDiv.createEl('br')
    })
  }

  private findMatches(text: string) {
    const highlights = this.highlights
    let remaining = text
    const results: { before: string; match: string; color: string; after: string }[] = []

    let color = ''

    while (remaining.length > 0) {
      let earliestIndex = -1
      let matchedSubstr = ''

      for (const highlight of highlights) {
        const target = highlight.section

        const index = remaining.indexOf(target)
        if (index !== -1 && (earliestIndex === -1 || index < earliestIndex)) {
          earliestIndex = index
          matchedSubstr = target
          color = highlight.color
        }
      }

      // if (earliestIndex === -1) break
      if (earliestIndex === -1) {
        if (results.length === 0) {
          results.push({before: text, match: '', color: '', after: ''})
        }
        break
      }

      const before = remaining.slice(0, earliestIndex)
      const after = remaining.slice(earliestIndex + matchedSubstr.length)

      results.push({before, match: matchedSubstr, color, after})
      remaining = after
    }

    return results
  }

  private get app() {
    return this.plugin.app
  }

  private get highlights(): SectionHighlight[] {
    return this.settings.highlights
  }

  private get settings() {
    return this.plugin.settings
  }

}



