export class OllFieldInput {
  ollFieldInputWidth: number;
  parsedRows: string[][];


  constructor(ollFieldInputWidth: number) {
    this.ollFieldInputWidth = ollFieldInputWidth;
    this.parsedRows = new Array<string[]>();
  }

  addRow(parsedRow: string[]): void {
    // console.log('add row: ', parsedRow);
    this.parsedRows[this.parsedRows.length] = parsedRow;
  }

  getColor(xRow: number, yCol: number): string {
    let colorIndex: string = this.parsedRows[xRow][yCol];
    return this.getColorHex(colorIndex);
  }

  length(): number {
    return this.parsedRows[0].length;
  }

  toString(): string {
    let s: string = '';
    for (let i: number = 0; i < this.parsedRows.length; i++) {
      let row: string[] = this.parsedRows[i];
      for (let ii: number = 0; ii < row.length; ii++) {
        s = s + row[ii];
      }
      s = s + '\n';
    }
    return s;
  }

  private getColorHex(colorIndex:string):string {
    let c:string = '#000';
    if (!colorIndex) {
      c = '#f00';
    } else {
      switch (colorIndex) {

        case 'r': c = '#aa0000'; break; // darker red (80%)
        case 'R': c = '#ff0000'; break; // red

        case 'o': c = '#aa4000'; break; // darker orange
        case 'O': c = '#ff6400'; break; // orange

        case 'b': c = '#000070'; break; // darker blue
        case 'B': c = '#0000bb'; break; // blue

        case 'g': c = '#007000'; break; // darker green
        case 'G': c = '#00bb00'; break; // green

        case 'y': c = '#aaaa00'; break; // darker yellow
        case 'Y': c = '#ffff00'; break; // yellow

        case 'W': c = '#ffffff'; break; // white
        case 'w': c = '#cccccc'; break; // grey (80%)

        case '.': c = '#444'; break;
        case '0': c = '#444'; break;
        case '1': c = '#ff0'; break;
        default:  c = '#000'; break;
      }
    }
    // console.log("getColor() '"+colorIndex+"' => '"+c+"'")
    return c;
  }


}
