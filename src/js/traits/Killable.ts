import { Entity } from "../entities/base";
import Level from "../Level";
import { Trait } from "./base";

export default class Killable extends Trait {
  dead: boolean;
  deadTime: number;
  removeAfter: number;

  constructor(entity: Entity) {
    super(entity);
    this.dead = false;
    this.deadTime = 0;
    this.removeAfter = 2;
  }

  kill() {
    this.queue(() => this.dead = true);
  }

  revive() {
    this.dead = false;
    this.deadTime = 0;
  }

  update(entity: Entity, deltaTime: number, level: Level) {
    if (this.dead) {
      this.deadTime += deltaTime;
      if (this.deadTime > this.removeAfter) {
        this.queue(() => {
          level.entities.delete(entity);
        });
      }
    }
  }
}
