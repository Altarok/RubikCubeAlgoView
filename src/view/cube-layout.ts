
export interface CubeLayout {
  mainContainer: HTMLDivElement;
  cubeDiv: HTMLDivElement;
  buttonDiv: HTMLDivElement;
  algorithmsDiv: HTMLDivElement;
}

export function createCubeLayout(container: HTMLElement): CubeLayout {

  const mainContainer: HTMLDivElement = container.createEl('div', { cls: 'rubik-cube-div-main-container' });

  /* left */
  const leftSide: HTMLDivElement = mainContainer.createEl('div', { cls: 'rubik-cube-div-left-column' });
  /* right */
  const textSide: HTMLDivElement = mainContainer.createEl('div', { cls: 'rubik-cube-div-right-column' });

  const cubeDiv: HTMLDivElement = leftSide.createEl('div', { attr: { id: 'cubeDiv' }, cls: 'rotatable' });
  const buttonDiv: HTMLDivElement = leftSide.createEl('div', { attr: { id: 'buttonDiv' }, cls: 'button-container' });
  const algorithmsDiv: HTMLDivElement = textSide.createEl('div', { attr: { id: 'algorithmsDiv' } });

  return { mainContainer, cubeDiv, buttonDiv, algorithmsDiv };
}
