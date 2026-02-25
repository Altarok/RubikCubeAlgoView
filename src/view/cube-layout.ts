
export interface CubeLayout {
  readonly mainContainer: HTMLDivElement;
  readonly cubeDiv: HTMLDivElement;
  readonly buttonDiv: HTMLDivElement;
  readonly algorithmsDiv: HTMLDivElement;
}

export function createCubeLayout(container: HTMLElement): CubeLayout {

  const mainContainer = container.createEl('div', { cls: 'rubik-cube-div-main-container' });

  /* left */
  const leftSide = mainContainer.createEl('div', { cls: 'rubik-cube-div-left-column' });
  /* right */
  const textSide = mainContainer.createEl('div', { cls: 'rubik-cube-div-right-column' });

  const cubeDiv = leftSide.createEl('div', { attr: { id: 'cubeDiv' }, cls: 'rotatable' });
  const buttonDiv = leftSide.createEl('div', { attr: { id: 'buttonDiv' }, cls: 'button-container' });
  const algorithmsDiv = textSide.createEl('div', { attr: { id: 'algorithmsDiv' } });

  return { mainContainer, cubeDiv, buttonDiv, algorithmsDiv };
}
