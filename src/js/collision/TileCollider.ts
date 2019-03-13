import { Side } from "../constants";
import { Entity } from "../entities/base";
import { Matrix } from "../math";
import TileResolver from './TileResolver';

export default class TileCollider {
  tiles: TileResolver;

  constructor(tileMatrix: Matrix) {
    this.tiles = new TileResolver(tileMatrix);
  }

  checkX(entity: Entity) {
    let x;
    if (entity.vel.x > 0)
      x = entity.bounds.right;
    else if (entity.vel.x < 0)
      x = entity.bounds.left;
    else
      return;

    const matches = this.tiles.searchByRange(
      x, x,
      entity.bounds.top, entity.bounds.bottom
    );

    for (const match of matches) {
      if (match.tile.type !== 'ground')
        continue;  // todo: write test for it

      if (entity.vel.x > 0) {
        if (entity.bounds.right > match.x1) {
          entity.obstruct(Side.Right, match);
        }
      } else if (entity.vel.x < 0) {
        if (entity.bounds.left < match.x2) {
          entity.obstruct(Side.Left, match);
        }
      }
    }
  }

  checkY(entity: Entity) {
    let y;
    if (entity.vel.y > 0)
      y = entity.bounds.bottom;
    else if (entity.vel.y < 0)
      y = entity.bounds.top;
    else
      return;

    const matches = this.tiles.searchByRange(
      entity.bounds.left, entity.bounds.right,
      y, y
    );

    for (const match of matches) {
      if (match.tile.type !== 'ground')
        continue;  // todo: write test for it

      if (entity.vel.y > 0) {
        if (entity.bounds.bottom > match.y1) {
          entity.obstruct(Side.Bottom, match);
        }
      } else if (entity.vel.y < 0) {
        if (entity.bounds.top < match.y2) {
          entity.obstruct(Side.Top, match);
        }
      }
    }
  }
}
