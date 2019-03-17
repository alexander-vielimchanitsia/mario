import { Matrix } from './math';
import { isString } from './utils/common';

export interface IPatterns {
  [tileId: string]: IPattern;
}
export interface IPattern {
  maxX?: number;
  minX?: number;
  maxY?: number;
  minY?: number;
  tiles: {
    [address: string]: ITile;
  };
}
export interface ITile {
  name: string;
  type?: string;
}

const DEFAULT_TILE = {'name': 'sky'};
const PATTERNS: IPatterns = {
  ' ': {'tiles': {'1:1': {'name': 'sky'}}},
  '?': {'tiles': {'1:1': {'name': 'chance', 'type': 'ground'}}},
  '%': {'tiles': {'1:1': {'name': 'bricks', 'type': 'ground'}}},
  '#': {'tiles': {'1:1': {'name': 'ground', 'type': 'ground'}}},
  '|': {
    'maxX': 2,
    'minX': 2,
    'maxY': Number.POSITIVE_INFINITY,
    'minY': 2,
    'tiles': {
      '1:1': {'name': 'pipe-insert-vert-left', 'type': 'ground'},
      '2:1': {'name': 'pipe-insert-vert-right', 'type': 'ground'},
      '1:y': {'name': 'pipe-vert-left', 'type': 'ground'},
      '2:y': {'name': 'pipe-vert-right', 'type': 'ground'},
    },
  },
};

export function parseLevel(levelMap: string): Matrix {
  let x = 0;
  let y = 0;
  const tilesMap = new Matrix();
  for (const char of levelMap) {
    if (char === '\n') {
      x = 0;
      y++;
      continue;
    }
    tilesMap.set(x++, y, char);
  }
  return tilesMap;
}

export function setTile(matrix: Matrix, x: number, y: number): object {
  const tile = matrix.get(x, y);
  // already set a tile
  if (tile && !isString(tile)) return;

  const pattern = PATTERNS[tile];

  // set default tile if it isn't specified
  if (!pattern) {
    matrix.set(x, y, DEFAULT_TILE);
    return;
  }

  const tiles = pattern.tiles;
  // to do...

  return {x, y};
}

export function findAllAdjoiningTiles(
  matrix: Matrix,
  tile: string,
  pattern: IPattern,
  x: number,
  y: number
) : {startX: number, endX: number, startY: number, endY: number} | undefined {
  const maxX = pattern.maxX || 1;
  const minX = pattern.minX || 1;
  const maxY = pattern.maxY || 1;
  const minY = pattern.minY || 1;

  let lastValidXLen = 0;
  let lastValidYLen = 0;

  // TODO: refactor it to start from x=1 & y=1 (to skip checking first tile, which we've already got)
  let xLen = 0;
  let yLen = 0;

  while (xLen < maxX || yLen < maxY && matrix.get(x+xLen, y+yLen) === tile) {
    // find all adjoining tiles of the same type, in current line
    while (xLen < maxX  && matrix.get(x+xLen, y+yLen) === tile) {
      xLen++;
    }
    // check whether there're enough tiles in the line
    if (xLen < minX) {
      if (yLen < minY) {
        console.warn(`Could not find enough "${tile}"; missing at pos=${x+xLen}:${y+yLen}`);
        // TODO: set ERROR sprite?
        return;
      }
      break;
    }
    // go to next line
    if (yLen < maxY) {
      lastValidXLen = xLen;
      lastValidYLen = yLen;
      yLen++;
      xLen = 0;
    }
  }
  return {
    startX: x,
    endX: x+lastValidXLen-1,
    startY: y,
    endY: y+lastValidYLen
  };
}
