import {CubeState} from "../model/cube-state"

export interface CubeLayout {
  readonly mainContainer: HTMLDivElement
  readonly cubeDiv: HTMLDivElement
  readonly setupDiv: HTMLDivElement | undefined
  readonly buttonDiv: HTMLDivElement | undefined
  readonly algorithmsDiv: HTMLDivElement
}

export function createCubeLayout(container: HTMLElement, cubeState: CubeState): CubeLayout {

  const mainContainer = container.createEl('div')
  /*
   * TODO this following line is redundant, added to tell CI to shut up about unused css classes. which did not work. find a new way to do this
   */
  mainContainer.className = 'rubik-cube-div-main-container'

  const leftSide = mainContainer.createEl('div', {cls: 'rubik-cube-div-left-column'})
  const rightSide = mainContainer.createEl('div', {cls: 'rubik-cube-div-right-column'})

  const cubeDiv = leftSide.createEl('div', {cls: 'rubik-cube-div-content'})

  let setupDiv: HTMLDivElement | undefined = undefined
  let buttonDiv: HTMLDivElement | undefined = undefined

  if (shouldCreateSetupAlgorithmDiv(cubeState))
    setupDiv = rightSide.createEl('div', {attr: {id: 'setupDiv'}, cls: 'rubik-cube-algorithms-monotone-box'})

  if (shouldCreateButtonDiv(cubeState))
    buttonDiv = leftSide.createEl('div', {attr: {id: 'buttonDiv'}, cls: 'button-container'})

  const algorithmsDiv = rightSide.createEl('div', {attr: {id: 'algorithmsDiv'}, cls: 'rubik-cube-div-algorithms-list'})

  return {mainContainer, cubeDiv, setupDiv, buttonDiv, algorithmsDiv}
}

function shouldCreateSetupAlgorithmDiv(cubeState: CubeState): boolean {
  return !cubeState.flags.contains('no-setup') && cubeState.setup !== undefined
}

function shouldCreateButtonDiv(cubeState: CubeState): boolean {
  return !cubeState.flags.contains('no-buttons')
}

