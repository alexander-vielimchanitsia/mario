import { createAnimation } from './animation';
import SpriteSheet from './SpriteSheet';
import { IAnimationSpriteSpec, IFrameSpriteSpec, ISpriteSpec, ITileSpriteSpec } from './typings/sprites';

// todo: use a decorator instead?
// const IMAGE_CACHE = {} as any;

export function loadImage(url: string) {
  return new Promise(resolve => {
    // const savedImage = IMAGE_CACHE[url];
    // if (savedImage) {
    //   if (!savedImage.complete) {
    //     savedImage.addEventListener('load', () => {
    //       // do something here
    //     });
    //   } else {
    //     return IMAGE_CACHE[url];
    //   }
    // }
    const image = new Image();
    image.addEventListener('load', () => {
      resolve(image);
    });
    image.src = url;
  });
}

export function loadJSON(url: string) {
  return fetch(url)
  .then(response => response.json());
}

export function loadText(url: string) {
  return fetch(url)
  .then(response => response.text());
}

export function loadSpriteSheet(name: string) {
  return loadJSON(`/src/sprites/${name}.json`)
  .then((sheetSpec: ISpriteSpec) => Promise.all([
    sheetSpec,
    loadImage(sheetSpec.imageURL),
  ]))
  .then(([sheetSpec, image]) => {
    const sprites = new SpriteSheet(
      <HTMLImageElement>image,
      sheetSpec.tileW,
      sheetSpec.tileH);

    if (sheetSpec.tiles) {
      for (const tileSpec of (<ISpriteSpec>sheetSpec).tiles) {
        sprites.defineTile(
          tileSpec.name,
          tileSpec.index[0],
          tileSpec.index[1]
        );
      }
    }

    if (sheetSpec.frames) {
      for (const frameSpec of (<ISpriteSpec>sheetSpec).frames) {
        sprites.define(frameSpec.name, frameSpec.rect[0], frameSpec.rect[1], frameSpec.rect[2], frameSpec.rect[3]);
      }
    }

    if (sheetSpec.animations) {
      for (const animSpec of (<ISpriteSpec>sheetSpec).animations) {
        const animation = createAnimation(animSpec.frames, animSpec.frameLen);
        sprites.defineAnim(animSpec.name, animation);
      }
    }

    return sprites;
  });
}
