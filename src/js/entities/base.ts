import BoundingBox from "../BoundingBox";
import { Side } from "../constants";
import { PlayerEnv } from "../game";
import Level from "../Level";
import { Vector2 } from "../math";
import SpriteSheet from "../SpriteSheet";
import { Trait } from "../traits/base";
import { TileResolverMatch } from "../typings/core";

export abstract class Entity {
  pos: Vector2;
  vel: Vector2;
  size: Vector2;
  offset: Vector2;
  bounds: BoundingBox;
  lifetime: number;
  traits: Trait[];

  protected constructor(public sprite: SpriteSheet) {
    this.pos = new Vector2(0, 0);
    this.vel = new Vector2(0, 0);
    this.size = new Vector2(0, 0);
    this.offset = new Vector2(0, 0);
    this.bounds = new BoundingBox(this.pos, this.size, this.offset);
    this.lifetime = 0;

    this.traits = [];
  }

  // abstract get currentSpriteName(): string;  TODO: use it after refactored PlayerEnv

  addTrait(trait: Trait) {
    this.traits.push(trait);
    // FIXME: implement it somehow
    // this[trait.constructor.name] = trait;
  }

  collides(candidate: Entity) {
    this.traits.forEach(trait => {
      trait.collides(this, candidate);
    });
  }

  obstruct(side: Side, match: TileResolverMatch) {
    this.traits.forEach(trait => {
      trait.obstruct(this, side, match);
    });
  }

  draw(context: CanvasRenderingContext2D) {}

  finalize() {
    this.traits.forEach(trait => {
      trait.finalize();
    });
  }

  update(deltaTime: number, level: Level) {
    this.traits.forEach(trait => {
      trait.update(this, deltaTime, level);
    });

    this.lifetime += deltaTime;
  }
}
