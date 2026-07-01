import {CubeState} from '../model/cube-state'
import {Strings} from '../consts/strings'

const CssClasses = Strings.CssClasses


export type CubeLayout = {
  readonly mainContainer: HTMLDivElement
  readonly cubeDiv: HTMLDivElement
  readonly setupDiv: HTMLDivElement | undefined
  readonly buttonDiv: HTMLDivElement | undefined
  readonly algorithmsDiv: HTMLDivElement
}

function createCubeLayout(container: HTMLElement, cubeState: CubeState): CubeLayout {

  const mainContainer = container.createEl('div', {cls: CssClasses.layout.mainContainer})
  const leftSide = mainContainer.createEl('div', {cls: CssClasses.layout.leftColumn})
  const rightSide = mainContainer.createEl('div', {cls: CssClasses.layout.rightColumn})
  const cubeDiv = leftSide.createEl('div', {cls: CssClasses.layout.content})

  let setupDiv: HTMLDivElement | undefined = undefined
  let buttonDiv: HTMLDivElement | undefined = undefined

  if (shouldCreateSetupAlgorithmDiv(cubeState))
    setupDiv = rightSide.createEl('div', {attr: {id: 'setupDiv'}, cls: CssClasses.layout.setupBox})

  if (shouldCreateButtonDiv(cubeState))
    buttonDiv = leftSide.createEl('div', {attr: {id: 'buttonDiv'}, cls: CssClasses.buttons.container})

  const algorithmsDiv = rightSide.createEl('div', {attr: {id: 'algorithmsDiv'}, cls: CssClasses.layout.algorithmsList})

  return {mainContainer, cubeDiv, setupDiv, buttonDiv, algorithmsDiv}
}

export default createCubeLayout

function shouldCreateSetupAlgorithmDiv(cubeState: CubeState): boolean {
  return !cubeState.flags.contains('no-setup') && cubeState.setup !== undefined
}

function shouldCreateButtonDiv(cubeState: CubeState): boolean {
  return !cubeState.flags.contains('no-buttons')
}

