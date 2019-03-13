import { Side } from "../constants";
import { Entity } from "../entities/base";
import { TileResolverMatch } from "../typings/core";
import { Trait } from "./base";

export default class Solid extends Trait {
  obstructs: boolean;

  constructor(entity: Entity) {
    super(entity);
    this.obstructs = true;
  }

  obstruct(entity: Entity, side: Side, match: TileResolverMatch) {
    if (!this.obstructs) return;

    if (side === Side.Bottom) {
      entity.bounds.bottom = match.y1;
      entity.vel.y = 0;
    } else if (side === Side.Top) {
      entity.bounds.top = match.y2;
      entity.vel.y = 0;
    } else if (side === Side.Left) {
      entity.bounds.left = match.x2;
      entity.vel.x = 0;
    } else if (side === Side.Right) {
      entity.bounds.right = match.x1;
      entity.vel.x = 0;
    }
  }
}
