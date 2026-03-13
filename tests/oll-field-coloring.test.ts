import {describe, it, expect} from 'vitest';
import {OllFieldColoring} from "../src/model/oll-field-coloring";

const cubeColor = '#123';


describe('OllFieldColoring default constructor', () => {

  it(`works`, () => {
    const ollFieldColoring = new OllFieldColoring(cubeColor);

    ollFieldColoring.addRow(['0', '1', '.']);
    ollFieldColoring.addRow(['r', 'R', 'o', 'O']);
    ollFieldColoring.addRow(['b', 'B', 'g', 'G']);
    ollFieldColoring.addRow(['y', 'Y', 'W', 'w']);

    expect(ollFieldColoring.getColor(0, 0)).toBe('#444');
    expect(ollFieldColoring.getColor(0, 1)).toBe(cubeColor);
    expect(ollFieldColoring.getColor(0, 2)).toBe('#444');
    expect(ollFieldColoring.getColor(0, 3)).toBe('#000');

    expect(ollFieldColoring.getColor(1, 0)).toBe('#a00');
    expect(ollFieldColoring.getColor(1, 1)).toBe('#f00');
    expect(ollFieldColoring.getColor(1, 2)).toBe('#994000');
    expect(ollFieldColoring.getColor(1, 3)).toBe('#ff6400');

    expect(ollFieldColoring.getColor(2, 0)).toBe('#000070');
    expect(ollFieldColoring.getColor(2, 1)).toBe('#00d');
    expect(ollFieldColoring.getColor(2, 2)).toBe('#006000');
    expect(ollFieldColoring.getColor(2, 3)).toBe('#0c0');

    expect(ollFieldColoring.getColor(3, 0)).toBe('#aa0');
    expect(ollFieldColoring.getColor(3, 1)).toBe('#ff0');
    expect(ollFieldColoring.getColor(3, 2)).toBe('#fff');
    expect(ollFieldColoring.getColor(3, 3)).toBe('#ccc');

  });


});
