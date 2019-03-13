import { loadSpriteSheet } from '../loaders';
import SpriteSheet from "../SpriteSheet";
import { Trait } from "../traits/base";
import Killable from '../traits/Killable';
import PendulumMove from '../traits/PendulumMove';
import Physics from '../traits/Physics';
import Solid from '../traits/Solid';
import { IEnemy } from "../typings/entities";
import { Entity } from "./base";
import { Mario } from "./Mario";

export class Goomba extends Entity implements IEnemy {
  readonly walkAnimation: (distance: number) => string;

  // Traits
  // =========================
  public physics = new Physics(this);
  public solid = new Solid(this);
  public pendulumMove = new PendulumMove(this);
  public behavior = new Behavior(this);
  public killable = new Killable(this);
  // =========================

  constructor(sprite: SpriteSheet) {
    super(sprite);
    this.size.set(16, 16);
    this.walkAnimation = sprite.animations.get('walk');
  }

  static async loadSprite() {
    return loadSpriteSheet('goomba');
  }

  get currentSpriteName(): string {
    if (this.killable.dead) {
      return 'flat';
    }
    return this.walkAnimation(this.lifetime);
  }

  draw(context: CanvasRenderingContext2D) {
    this.sprite.draw(this.currentSpriteName, context, 0, 0);
  }
}

class Behavior extends Trait {
  collides(us: Goomba, them: Mario /* fixme: refactor */) {
    if (us.killable.dead) {
      return;
    }

    if (them.stomper) {
      if (them.vel.y > us.vel.y) {
        us.killable.kill();
        us.pendulumMove.speed = 0;
      } else {
        them.killable.kill();
      }
    }
  }
}
