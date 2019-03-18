import { Goomba } from "../entities/Goomba";
import { Koopa } from "../entities/Koopa";
import { createBackgroundLayer } from '../layers/background';
import { createSpriteLayer } from '../layers/sprites';
import Level from '../Level';
import { loadSpriteSheet, loadText } from '../loaders';
import { parseLevel } from '../parseLevel';
import { ILevelSpec } from "../typings/level";

const ENTITIES: {[name: string]: any} = {
  goomba: Goomba,
  koopa: Koopa,
};

function setupEntities(levelSpec: ILevelSpec, level: Level) {
  const spriteLoads = levelSpec.entities.map(({name}) => ENTITIES[name].loadSprite());
  Promise.all([...spriteLoads]).then((sprites) => {
    levelSpec.entities.forEach(({name, pos: [x, y]}, i) => {
      const entity = new ENTITIES[name](sprites[i]);
      entity.pos.set(x, y);
      level.entities.add(entity);
    });
  });

  const spriteLayer = createSpriteLayer(level.entities);
  level.comp.layers.push(spriteLayer);
}

export function createLevelLoader() {
  return function loadLevel(name: string) {
    return loadText(`/src/levels/${name}.txt`)
    .then(levelMap => Promise.all([
      levelMap,
      loadSpriteSheet('overworld'),
    ]))
    .then(([levelMap, backgroundSprites]) => {
      const level = new Level();
      const parsedLevel = parseLevel(levelMap);

      // setup collision
      level.setCollisionGrid(parsedLevel);

      // setup backgrounds
      const backgroundLayer = createBackgroundLayer(level, parsedLevel, backgroundSprites);
      level.comp.layers.push(backgroundLayer);

      // setup entities
      const spriteLayer = createSpriteLayer(level.entities);
      level.comp.layers.push(spriteLayer);

      return level;
    });
  }
}
