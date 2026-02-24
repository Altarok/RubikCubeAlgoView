export class OllFieldColors {
  ollFieldInputWidth: number;
  parsedRows: string[][];

  constructor(ollFieldInputWidth: number) {
    this.ollFieldInputWidth = ollFieldInputWidth;
    this.parsedRows = new Array<string[]>();
  }

  addRow(parsedRow: string[]): void {
    // console.log('add row: ', parsedRow);
    this.parsedRows.push(parsedRow);
  }

  length(): number {
    return this.parsedRows[0]!.length;
  }

  toString(): string {
    let s: string = '';
    for (let i: number = 0; i < this.parsedRows.length; i++) {
      let row: string[] = this.parsedRows[i]!;
      for (let ii: number = 0; ii < row.length; ii++) {
        s = s + row[ii];
      }
      s = s + '\n';
    }
    return s;
  }

  getColor(yRow: number, xCol: number): string {
    let colorIndex: string = this.parsedRows[yRow]![xCol]!;
    return this.getColorHex(colorIndex);
  }

  private getColorHex(colorIndex: string): string {
    let c: string;
    if (colorIndex === undefined) {
      c = '#000';
    } else {
      switch (colorIndex) {

        /* @formatter:off */

        case 'r': c = '#aa0000'; break; // darker red
        case 'R': c = '#ff0000'; break; // red

        case 'o': c = '#994000'; break; // darker orange
        case 'O': c = '#ff6400'; break; // orange

        case 'b': c = '#000070'; break; // darker blue
        case 'B': c = '#0000dd'; break; // blue

        case 'g': c = '#006000'; break; // darker green
        case 'G': c = '#00cc00'; break; // green

        case 'y': c = '#aaaa00'; break; // darker yellow
        case 'Y': c = '#ffff00'; break; // yellow

        case 'W': c = '#ffffff'; break; // white
        case 'w': c = '#cccccc'; break; // grey (80%)

        case '.': c = '#444'; break;
        case '0': c = '#444'; break;
        case '1': c = '#ff0'; break;
        default:  c = '#000'; break;

        /* @formatter:on */
      }
    }
    // console.log("getColor() '" + colorIndex + "' => '" + c + "'")
    return c;
  }


}
