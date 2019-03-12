
export interface MatrixCell {
  name?: string,
  type?: string,
}

export interface TileResolverMatch {
  tile: MatrixCell;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}
