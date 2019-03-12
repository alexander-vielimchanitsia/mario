import { Side } from "../constants";
import { Entity } from "../entities/base";
import { Trait } from "./base";

export default class Jump extends Trait {
  ready: number;
  duration: number;
  engageTime: number;
  requestTime: number;
  gracePeriod: number;
  speedBoost: number;
  velocity: number;

  constructor(entity: Entity) {
    super(entity);

    this.ready = 0;
    this.duration = 0.3;
    this.engageTime = 0;
    this.requestTime = 0;
    this.gracePeriod = 0.1;
    this.speedBoost = 0.3;
    this.velocity = 200;
  }

  get falling() {
    return this.ready < 0;
  }

  start() {
    this.requestTime = this.gracePeriod;
  }

  cancel() {
    this.engageTime = 0;
    this.requestTime = 0;
  }

  obstruct(entity: Entity, side: Side) {
    if (side === Side.Bottom) {
      this.ready = 1;
    } else if (side === Side.Top) {
      this.cancel();
    }
  }

  update(entity: Entity, deltaTime: number) {
    if (this.requestTime > 0) {
      if (this.ready > 0) {
        this.engageTime = this.duration;
        this.requestTime = 0;
      }

      this.requestTime -= deltaTime;
    }

    if (this.engageTime > 0) {
      entity.vel.y = -(this.velocity + Math.abs(entity.vel.x) * this.speedBoost);
      this.engageTime -= deltaTime;
    }

    this.ready--;
  }
}
