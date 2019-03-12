import { MatrixCell } from "./typings/core";

export class Matrix {
  grid: MatrixCell[][];

  constructor() {
    this.grid = [];
  }

  forEach(callback: (value: MatrixCell, x: number, y: number) => void) {
    this.grid.forEach((column, x) => {
      column.forEach((value, y) => {
        callback(value, x, y);
      });
    });
  }

  get(x: number, y: number) {
    const col = this.grid[x];
    if (col) {
      return col[y];
    }
    return undefined;
  }

  set(x: number, y: number, value: MatrixCell) {
    if (!this.grid[x]) {
      this.grid[x] = [];
    }

    this.grid[x][y] = value;
  }
}

export class Vector2 {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.set(x, y);
  }

  public set(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
