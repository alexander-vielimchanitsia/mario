import { Matrix } from './math';
import { IPattern, IPatterns, ITile } from './typings/level';
import { isString } from './utils/common';

export const MAP_END = Symbol('mapEnd');

const DEFAULT_TILE = {'name': 'sky'};
export const PATTERNS: IPatterns = {
  ' ': {'tiles': {'0:0': {'name': 'sky'}}},
  '?': {'tiles': {'0:0': {'name': 'chance', 'type': 'ground'}}},
  '%': {'tiles': {'0:0': {'name': 'bricks', 'type': 'ground'}}},
  '#': {'tiles': {'0:0': {'name': 'ground', 'type': 'ground'}}},
  '|': {
    'maxX': 2,
    'minX': 2,
    'maxY': Number.POSITIVE_INFINITY,
    'minY': 2,
    'tiles': {
      '0:0': {'name': 'pipe-insert-vert-left', 'type': 'ground'},
      '1:0': {'name': 'pipe-insert-vert-right', 'type': 'ground'},
      '0:y': {'name': 'pipe-vert-left', 'type': 'ground'},
      '1:y': {'name': 'pipe-vert-right', 'type': 'ground'},
    },
  },
};

export function mapToMatrix(levelMap: string): Matrix {
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
  // specify that it's the end of the map
  tilesMap.set(x, y, MAP_END);
  return tilesMap;
}

export function parseLevel(levelMap: string): Matrix {
  const tilesMap = mapToMatrix(levelMap);
  let x = 0;
  let y = 0;

  while (1) {
    const tileAbbr = tilesMap.get(x, y);
    if (tileAbbr === MAP_END) {
      // parsed whole the map
      break;
    }
    if (tileAbbr === undefined) {
      x = 0;
      y++;
      continue;
    }

    const result = setTile(tilesMap, x, y);
    // set path of the next tile
    if (result) {
      x = result.x;
      y = result.y;
    } else {
      x++;
    }
  }
  return tilesMap;
}

export function setTile(
  matrix: Matrix,
  x: number,
  y: number
): {x: number, y: number} | undefined {
  const tileAbbr = matrix.get(x, y);
  // already set a tile
  if (tileAbbr && !isString(tileAbbr)) return;

  const pattern = PATTERNS[tileAbbr];

  // set default tile if it isn't specified
  if (!pattern) {
    matrix.set(x, y, DEFAULT_TILE);
    return;
  }

  const tilesPathToSet = identifySprite(matrix, tileAbbr, pattern, x, y);
  if (!tilesPathToSet) {
    // TODO: set ERROR sprite?
    return;
  }

  let currentX, currentY;
  for (currentY = tilesPathToSet.startY; currentY <= tilesPathToSet.endY; currentY++) {
    for (currentX = tilesPathToSet.startX; currentX <= tilesPathToSet.endX; currentX++) {
      const tile = getTile(tileAbbr, pattern, Math.abs(x-currentX), Math.abs(y-currentY));
      if (!tile) continue;
      if (matrix.get(currentX, currentY) !== tileAbbr) {
        console.warn(
          'Looks like something went wrong - trying to set tile of another tileAbbr. ' +
            `tileAbbr=${matrix.get(currentX, currentY)}, x=${currentY}, y=${currentY} tile:`,
          tile
        );
      }
      matrix.set(currentX, currentY, tile);
    }
  }
  return {x: currentX, y: y};
}

export function getTile(tileAbbr: string, pattern: IPattern, x: number, y: number): ITile | undefined {
  const addressPatterns = [`${x}:${y}`, `x:${y}`, `${x}:y`, 'x:y'];
  let tile;
  for (const address of addressPatterns) {
    tile = pattern.tiles[address];
    if (tile) break;
  }
  if (!tile) {
    console.warn(`Failed to find tile by address="${x}:${y}" for tileAbbr="${tileAbbr}"`)
  }
  return tile;
}

export function identifySprite(
  matrix: Matrix,
  tileAbbr: string,
  pattern: IPattern,
  x: number,
  y: number
): {startX: number, endX: number, startY: number, endY: number} | undefined {
  const maxX = pattern.maxX || 1;
  const minX = pattern.minX || 1;
  const maxY = pattern.maxY || 1;
  const minY = pattern.minY || 1;

  let xLen = 1;  // start from the next tile
  let yLen = 0;
  let lastValidXLen = xLen;
  let lastValidYLen = yLen;

  while (xLen < maxX || yLen < maxY && matrix.get(x+xLen, y+yLen) === tileAbbr) {  // TODO: refactor it
    // find all adjoining tiles of the same type, in current line
    while (xLen < maxX  && matrix.get(x+xLen, y+yLen) === tileAbbr) {
      xLen++;
    }
    // check whether there're enough tiles in the line
    if (xLen < minX) {
      if (yLen < minY) {
        console.warn(`Could not find enough "${tileAbbr}"; missing at pos=${x+xLen}:${y+yLen}`);
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
