import { Entity } from "../entities/base";
import { Mario } from "../entities/Mario";
import { Trait } from "./base";

export default class Stomper extends Trait {
  bounceSpeed: number;

  constructor(entity: Entity) {
    super(entity);
    this.bounceSpeed = 400;
  }

  onStomp(us: Entity, them: Entity) {}

  bounce(us: Entity, them: Entity) {
    us.bounds.bottom = them.bounds.top;
    us.vel.y = -this.bounceSpeed;
  }

  // TODO: use an interface(like Enemy | Character) instead of Mario
  collides(us: Mario, them: Mario) {
    if (!them.killable || them.killable.dead)
      return;

    if (us.vel.y > them.vel.y) {
      this.bounce(us, them);
      this.onStomp(us, them);
    }
  }
}
