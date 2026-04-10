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

  length(): number {
    return this.parsedRows[0]?.length ?? 0
  }

  getColor(yRow: number, xCol: number): string {
    let colorIndex: string | undefined = this.parsedRows[yRow]?.[xCol];
    return this.getColorHex(colorIndex);
  }

  private getColorHex(colorIndex: string | undefined): string {
    if (colorIndex === '1') return this.defaultCubeColor;
    return (colorIndex && colorMap[colorIndex]) ?? '#000';
  }

  toString(): string {
    return this.parsedRows.map(row => row.join('')).join('\n')
  }

  setupFixedOllInput(presetOutline: string) {
    let row1: string[] = ['-1', '0', '0', '0', '-1'];
    let row2: string[] = ['0', '0', '0', '0', '0'];
    let row3: string[] = ['0', '0', '1', '0', '0'];
    let row4: string[] = ['0', '0', '0', '0', '0'];
    let row5: string[] = ['-1', '0', '0', '0', '-1'];

    const input = presetOutline.split('');

    let s1 = input[0];
    let s2 = input[1];
    let s3 = input[2];
    let s4 = input[4];
    let s6 = input[6];
    let s7 = input[8];
    let s8 = input[9];
    let s9 = input[10];

    if (s1 == 'l') row2[0] = '1'; else if (s1 == 'b') row1[1] = '1'; else row2[1] = '1';
    if (s2 == 'b') row1[2] = '1'; else row2[2] = '1';
    if (s3 == 'r') row2[4] = '1'; else if (s3 == 'b') row1[3] = '1'; else row2[3] = '1';

    if (s4 == 'l') row3[0] = '1'; else row3[1] = '1';
    if (s6 == 'r') row3[4] = '1'; else row3[3] = '1';

    if (s7 == 'l') row4[0] = '1'; else if (s7 == 'f') row5[1] = '1'; else row4[1] = '1';
    if (s8 == 'f') row5[2] = '1'; else row4[2] = '1';
    if (s9 == 'r') row4[4] = '1'; else if (s9 == 'f') row5[3] = '1'; else row4[3] = '1';

    this.addRow(row1);
    this.addRow(row2);
    this.addRow(row3);
    this.addRow(row4);
    this.addRow(row5);
  }
}
