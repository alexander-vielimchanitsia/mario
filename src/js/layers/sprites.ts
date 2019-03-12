import Camera from "../Camera";
import { Entity } from "../entities/base";

export function createSpriteLayer(entities: Set<Entity>, width = 64, height = 64) {
  const spriteBuffer = document.createElement('canvas');
  spriteBuffer.width = width;
  spriteBuffer.height = height;
  const spriteBufferContext = spriteBuffer.getContext('2d');

  return function drawSpriteLayer(context: CanvasRenderingContext2D, camera: Camera) {
    entities.forEach(entity => {
      spriteBufferContext.clearRect(0, 0, width, height);

      entity.draw(spriteBufferContext);

      context.drawImage(
        spriteBuffer,
        entity.pos.x - camera.pos.x,
        entity.pos.y - camera.pos.y
      );
    });
  };
}
