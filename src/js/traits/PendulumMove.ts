import { Side } from "../constants";
import { Entity } from "../entities/base";
import { Trait } from "./base";

export default class PendulumMove extends Trait {
  enabled: boolean;
  speed: number;

  constructor(entity: Entity) {
    super(entity);
    this.enabled = true;
    this.speed = -30;
  }

  obstruct(entity: Entity, side: Side) {
    if (side === Side.Left || side === Side.Right)
      this.speed = -this.speed;
  }

  update(entity: Entity, deltaTime: number) {
    if (this.enabled)
      entity.vel.x = this.speed;
  }
}
