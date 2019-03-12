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

enum State {
  Walking,
  Hiding,
  Panic,
}

class Behavior extends Trait {
  hideTime: number;
  hideDuration: number;
  walkSpeed: number;
  panicSpeed: number;
  state: State;

  constructor(entity: Entity) {
    super(entity);

    this.hideTime = 0;
    this.hideDuration = 5;

    this.walkSpeed = null;
    this.panicSpeed = 300;

    this.state = State.Walking;
  }

  collides(us: Koopa, them: Mario) {
    if (us.killable.dead) {
      return;
    }

    if (them.stomper) {
      if (them.vel.y > us.vel.y) {
        this.handleStomp(us, them);
      } else {
        this.handleNudge(us, them);
      }
    }
  }

  handleNudge(us: Koopa, them: Mario) {
    if (this.state === State.Walking) {
      them.killable.kill();
    } else if (this.state === State.Hiding) {
      this.panic(us, them);
    } else if (this.state === State.Panic) {
      const travelDir = Math.sign(us.vel.x);
      const impactDir = Math.sign(us.pos.x - them.pos.x);
      if (travelDir !== 0 && travelDir !== impactDir) {
        them.killable.kill();
      }
    }
  }

  handleStomp(us: Koopa, them: Mario) {
    if (this.state === State.Walking) {
      this.hide(us);
    } else if (this.state === State.Hiding) {
      us.killable.kill();
      us.vel.set(100, -200);
      us.solid.obstructs = false;
    } else if (this.state === State.Panic) {
      this.hide(us);
    }
  }

  hide(us: Koopa) {
    us.vel.x = 0;
    us.pendulumMove.enabled = false;
    if (this.walkSpeed === null) {
      this.walkSpeed = us.pendulumMove.speed;
    }
    this.hideTime = 0;
    this.state = State.Hiding
  }

  unhide(us: Koopa) {
    us.pendulumMove.enabled = true;
    us.pendulumMove.speed = this.walkSpeed;
    this.state = State.Walking;
  }

  panic(us: Koopa, them: Mario) {
    us.pendulumMove.enabled = true;
    us.pendulumMove.speed = this.panicSpeed * Math.sign(them.vel.x);
    this.state = State.Panic;
  }

  update(us: Koopa, deltaTime: number) {
    if (this.state === State.Hiding) {
      this.hideTime += deltaTime;
      if (this.hideTime > this.hideDuration) {
        this.unhide(us);
      }
    }
  }
}

export class Koopa extends Entity implements IEnemy {
  readonly walkAnimation: (distance: number) => string;
  readonly wakeAnimation: (distance: number) => string;

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
    this.offset.y = 8;

    this.walkAnimation = sprite.animations.get('walk');
    this.wakeAnimation = sprite.animations.get('wake');
  }

  static async loadSprite() {
    return loadSpriteSheet('koopa');
  }

  routeAnim() {
    if (this.behavior.state === State.Hiding) {
      if (this.behavior.hideTime > 3) {
        return this.wakeAnimation(this.behavior.hideTime);
      }
      return 'hiding';
    }

    if (this.behavior.state === State.Panic) {
      return 'hiding';
    }

    return this.walkAnimation(this.lifetime);
  }

  draw(context: CanvasRenderingContext2D) {
    this.sprite.draw(this.routeAnim(), context, 0, 0, this.vel.x < 0);
  }
}
