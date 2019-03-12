import { Goomba } from "../entities/Goomba";
import { Koopa } from "../entities/Koopa";
import { createBackgroundLayer } from '../layers/background';
import { createSpriteLayer } from '../layers/sprites';
import Level from '../Level';
import { loadJSON, loadSpriteSheet } from '../loaders';
import { Matrix } from '../math';
import SpriteSheet from "../SpriteSheet";
import { ILevelSpec, IPatternsLevelSpec, ITileLevelSpec } from "../typings/level";

function setupCollision(levelSpec: ILevelSpec, level: Level) {
  const mergedTiles = levelSpec.layers.reduce((mergedTiles, layerSpec) => {
    return mergedTiles.concat(layerSpec.tiles);
  }, []);
  const collisionGrid = createCollisionGrid(mergedTiles, levelSpec.patterns);
  level.setCollisionGrid(collisionGrid);
}

function setupBackgrounds(levelSpec: ILevelSpec, level: Level, backgroundSprites: SpriteSheet) {
  levelSpec.layers.forEach((layer) => {
    const backgroundGrid = createBackgroundGrid(layer.tiles, levelSpec.patterns);
    const backgroundLayer = createBackgroundLayer(level, backgroundGrid, backgroundSprites);
    level.comp.layers.push(backgroundLayer);
  });
}

const ENTITIES: {[name: string]: any} = {
  goomba: Goomba,
  koopa: Koopa,
};

function setupEntities(levelSpec: ILevelSpec, level: Level) {
  // fixme: call loadSprite without blocking (do Promise.all for all sprites at once)
  levelSpec.entities.forEach(async ({name, pos: [x, y]}) => {
    const entity = new ENTITIES[name](await ENTITIES[name].loadSprite());
    entity.pos.set(x, y);
    level.entities.add(entity);
  });

  const spriteLayer = createSpriteLayer(level.entities);
  level.comp.layers.push(spriteLayer);
}

// export function createLevelLoader(entityFactory) {
export function createLevelLoader() {
  return function loadLevel(name: string) {
    return loadJSON(`/src/levels/${name}.json`)
      .then(levelSpec => Promise.all([
        levelSpec,
        loadSpriteSheet(levelSpec.spriteSheet),
      ]))
      .then(([levelSpec, backgroundSprites]) => {
        const level = new Level();

        setupCollision(levelSpec, level);
        setupBackgrounds(levelSpec, level, backgroundSprites);
        setupEntities(levelSpec, level);

        return level;
      });
  }
}

function createCollisionGrid(tiles: ITileLevelSpec[], patterns: IPatternsLevelSpec) {
  const grid = new Matrix();

  for (const {tile, x, y} of expandTiles(tiles, patterns)) {
    grid.set(x, y, {type: tile.type});
  }

  return grid;
}

function createBackgroundGrid(tiles: ITileLevelSpec[], patterns: IPatternsLevelSpec) {
  const grid = new Matrix();

  for (const {tile, x, y} of expandTiles(tiles, patterns)) {
    grid.set(x, y, {name: tile.name});
  }

  return grid;
}


function* expandSpan(xStart: number, xLen: number, yStart: number, yLen: number): IterableIterator<{x: number, y: number}> {
  const xEnd = xStart + xLen;
  const yEnd = yStart + yLen;
  for (let x = xStart; x < xEnd; ++x) {
    for (let y = yStart; y < yEnd; ++y) {
      yield {x, y};
    }
  }
}

function expandRange(range: number[]): IterableIterator<{x: number, y: number}> {
  if (range.length === 4) {
    const [xStart, xLen, yStart, yLen] = range;
    return expandSpan(xStart, xLen, yStart, yLen);

  } else if (range.length === 3) {
    const [xStart, xLen, yStart] = range;
    return expandSpan(xStart, xLen, yStart, 1);

  } else if (range.length === 2) {
    const [xStart, yStart] = range;
    return expandSpan(xStart, 1, yStart, 1);
  }
}

function* expandRanges(ranges: number[][]): IterableIterator<{x: number, y: number}> {
  for (const range of ranges) {
    yield* expandRange(range);
  }
}

function* expandTiles(tiles: ITileLevelSpec[], patterns: IPatternsLevelSpec) {
  function* walkTiles(tiles: ITileLevelSpec[], offsetX: number, offsetY: number): IterableIterator<{tile: ITileLevelSpec, x: number, y: number}> {
    for (const tile of tiles) {
      for (const {x, y} of expandRanges(tile.ranges)) {
        const derivedX = x + offsetX;
        const derivedY = y + offsetY;


        if (tile.pattern) {
          const tiles = patterns[tile.pattern].tiles;
          yield* walkTiles(tiles, derivedX, derivedY);
        } else {
          yield {
            tile,
            x: derivedX,
            y: derivedY,
          };
        }
      }
    }
  }

  yield* walkTiles(tiles, 0, 0);
}
