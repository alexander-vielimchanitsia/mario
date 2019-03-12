import { loadImage } from '../loaders';
import SpriteSheet from '../SpriteSheet';

const CHARS = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';

export class Font {
  size: number;
  sprites: SpriteSheet;

  constructor(sprites: SpriteSheet, size: number) {
    this.sprites = sprites;
    this.size = size;
  }

  print(text: string, context: CanvasRenderingContext2D, x: number, y: number) {
    [...text].forEach((char, pos) => {
      this.sprites.draw(char, context, x + pos * this.size, y);
    });
  }
}

export function loadFont() {
  return loadImage('/src/img/font.png')
    .then((image: HTMLImageElement) => {
      const size = 8;
      const rowLen = image.width;
      const fontSprite = new SpriteSheet(image, size, size);
      for (let [index, char] of [...CHARS].entries()) {
        const x = index * size % rowLen;
        const y = Math.floor(index * size / rowLen) * size;
        fontSprite.define(char, x, y, size, size);
      }

      return new Font(fontSprite, size);
    });
}
