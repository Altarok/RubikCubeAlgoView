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

  const mainContainer = container.createDiv({cls: CssClasses.layout.mainContainer})
  const leftSide = mainContainer.createDiv({cls: CssClasses.layout.leftColumn})
  const rightSide = mainContainer.createDiv({cls: CssClasses.layout.rightColumn})
  const cubeDiv = leftSide.createDiv({cls: CssClasses.layout.content})

  let setupDiv: HTMLDivElement | undefined = undefined
  let buttonDiv: HTMLDivElement | undefined = undefined

  if (shouldCreateSetupAlgorithmDiv(cubeState)) {
    setupDiv = rightSide.createDiv({attr: {id: 'setupDiv'}, cls: CssClasses.layout.setupBox})
  }

  if (shouldCreateButtonDiv(cubeState)) {
    buttonDiv = leftSide.createDiv({attr: {id: 'buttonDiv'}, cls: CssClasses.buttons.container})
  }

  const algorithmsDiv = rightSide.createDiv({attr: {id: 'algorithmsDiv'}, cls: CssClasses.layout.algorithmsList})

  return {mainContainer, cubeDiv, setupDiv, buttonDiv, algorithmsDiv}
}

export default createCubeLayout

function shouldCreateSetupAlgorithmDiv(cubeState: CubeState): boolean {
  return !cubeState.flags.contains('no-setup') && cubeState.setup !== undefined
}

function shouldCreateButtonDiv(cubeState: CubeState): boolean {
  return !cubeState.flags.contains('no-buttons')
}

