const colorMap: Record<string, string> = {
  'r': '#a00', // darker red
  'R': '#f00', // red
  'o': '#994000', // darker orange
  'O': '#ff6400', // orange
  'b': '#000070', // darker blue
  'B': '#00d', // blue
  'g': '#006000', // darker green
  'G': '#0c0', // green
  'y': '#aa0', // darker yellow
  'Y': '#ff0', // yellow
  'W': '#fff', // white
  'w': '#ccc', // grey (80%)
  '.': '#444',    // dark field (for binary input or background)
  '0': '#444',    // dark field (for binary input)
};

export class OllFieldColoring {
  parsedRows: string[][] = [];

  constructor(readonly defaultCubeColor: string) {
  }

  addRow(parsedRow: string[]): void {
    // console.log('add row: ', parsedRow);
    this.parsedRows.push(parsedRow);
  }

  length = () => this.parsedRows[0]?.length ?? 0;

  getColor(yRow: number, xCol: number): string {
    let colorIndex: string | undefined = this.parsedRows[yRow]?.[xCol];
    return this.getColorHex(colorIndex);
  }

  private getColorHex(colorIndex: string | undefined): string {
    if (colorIndex === '1') return this.defaultCubeColor;
    return (colorIndex && colorMap[colorIndex]) ?? '#000';
  }

  toString = () => this.parsedRows.map(row => row.join('')).join('\n');
}
