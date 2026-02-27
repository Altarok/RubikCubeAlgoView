const colorMap: Record<string, string> = {
  'r': '#aa0000', // darker red
  'R': '#ff0000', // red
  'o': '#994000', // darker orange
  'O': '#ff6400', // orange
  'b': '#000070', // darker blue
  'B': '#0000dd', // blue
  'g': '#006000', // darker green
  'G': '#00cc00', // green
  'y': '#aaaa00', // darker yellow
  'Y': '#ffff00', // yellow
  'W': '#ffffff', // white
  'w': '#cccccc', // grey (80%)
  '.': '#444',    // dark field (for binary input or background)
  '0': '#444',    // dark field (for binary input)
  '1': '#ff0'     // bright field (for binary input) TODO replace with default
};

export class OllFieldColoring {
  parsedRows: string[][] = [];

  addRow(parsedRow: string[]): void {
    // console.log('add row: ', parsedRow);
    this.parsedRows.push(parsedRow);
  }

  length = () => this.parsedRows[0]?.length ?? 0;

  getColor(yRow: number, xCol: number): string {
    let colorIndex: string | undefined = this.parsedRows[yRow]?.[xCol];
    return this.getColorHex(colorIndex);
  }

  private getColorHex(index: string | undefined): string {
    return (index && colorMap[index]) ?? '#000';
  }

  toString = () => this.parsedRows.map(row => row.join('')).join('\n');
}
