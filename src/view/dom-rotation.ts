/**
 * Applies a CSS rotation to a given element.
 */
export function applyRotation(element: HTMLElement, degrees: number): void {
  element.style.transform = `rotate(${degrees}deg)`;
  // 1
  // element.style.setProperty('--cube-rotation', `${degrees}deg`);
  // 2
  // element.style.display = 'block';
  // element.style.transformOrigin = 'center';
  // element.style.transform = `rotate(${degrees}deg)`;
}
