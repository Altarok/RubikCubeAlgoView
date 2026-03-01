
export interface CubeLayout {
  readonly mainContainer: HTMLDivElement;
  readonly cubeDiv: HTMLDivElement;
  readonly buttonDiv: HTMLDivElement | undefined;
  readonly algorithmsDiv: HTMLDivElement;
}

export function createCubeLayout(container: HTMLElement, skipButtons: boolean): CubeLayout {

  const mainContainer = container.createEl('div', { cls: 'rubik-cube-div-main-container' });

  /* left */
  const leftSide = mainContainer.createEl('div', { cls: 'rubik-cube-div-left-column' });
  /* right */
  const textSide = mainContainer.createEl('div', { cls: 'rubik-cube-div-right-column' });

  const cubeDiv = leftSide.createEl('div', { /*cls: 'rotatable',*/ cls: 'rubik-cube-div-content' });

  let buttonDiv: HTMLDivElement | undefined;

  if (skipButtons) {
    buttonDiv = undefined;
  } else {
    buttonDiv = leftSide.createEl('div', { attr: { id: 'buttonDiv' }, cls: 'button-container' });
  }
  const algorithmsDiv = textSide.createEl('div', { attr: { id: 'algorithmsDiv' }, cls: 'rubik-cube-div-algorithms-list' });

  return { mainContainer, cubeDiv, buttonDiv, algorithmsDiv };
}
