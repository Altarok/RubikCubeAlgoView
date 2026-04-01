/**
 * Applies a CSS rotation to a given element.
 */
export function applyRotation(element: HTMLElement, degrees: number): void {
  element.style.transform = `rotate(${degrees}deg)`;
}
