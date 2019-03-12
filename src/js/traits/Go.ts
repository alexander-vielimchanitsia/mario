import { Entity } from "../entities/base";
import { Mario } from "../entities/Mario";
import { Trait } from "./base";

export default class Go extends Trait {
  dir: number;
  acceleration: number;
  deceleration: number;
  dragFactor: number;
  distance: number;
  heading: number;

  constructor(entity: Entity) {
    super(entity);
    this.dir = 0;
    this.acceleration = 400;
    this.deceleration = 300;
    this.dragFactor = 1/5000;

    this.distance = 0;
    this.heading = 1;
  }

  update(entity: Mario, deltaTime: number) {
    const absX = Math.abs(entity.vel.x);

    if (this.dir !== 0) {
      entity.vel.x += this.acceleration * deltaTime * this.dir;

      if (entity.jump) {
        if (entity.jump.falling === false) {
          this.heading = this.dir;
        }
      } else {
        this.heading = this.dir;
      }

    } else if (entity.vel.x !== 0) {
      const decel = Math.min(absX, this.deceleration * deltaTime);
      entity.vel.x += entity.vel.x > 0 ? -decel : decel;
    } else {
      this.distance = 0;
    }

    entity.vel.x -= this.dragFactor * entity.vel.x * absX;

    this.distance += absX * deltaTime;
  }
}
