import { loadSpriteSheet } from '../loaders';
import SpriteSheet from "../SpriteSheet";
import Go from '../traits/Go';
import Jump from '../traits/Jump';
import Killable from '../traits/Killable';
import Physics from '../traits/Physics';
import Solid from '../traits/Solid';
import Stomper from '../traits/Stomper';
import { Entity } from './base';

const SLOW_DRAG = 1/1000;
const FAST_DRAG = 1/5000;

export class Mario extends Entity {
  runAnimation: (distance: number) => string;

  // TODO: get rid of it... use inheritance or mixins or something yet..
  // TODO: like: `class Mario extends Entity implements Physics, Go, Jump, ...`
  physics: Physics;
  solid: Solid;
  go: Go;
  jump: Jump;
  killable: Killable;
  stomper: Stomper;

  constructor(sprite: SpriteSheet) {
    super(sprite);
    this.size.set(14, 16);

    // Traits
    // =========================
    this.physics = new Physics(this);
    this.solid = new Solid(this);
    this.go = new Go(this);
    this.jump = new Jump(this);
    this.killable = new Killable(this);
    this.stomper = new Stomper(this);
    // =========================

    this.killable.removeAfter = 0;

    this.runAnimation = sprite.animations.get('run');

    this.turbo(false);
  }

  static async loadSprite() {
    return loadSpriteSheet('mario');
  }

  routeFrame() {
    if (this.jump.falling) {
      return 'jump';
    }

    if (this.go.distance > 0) {
      if ((this.vel.x > 0 && this.go.dir < 0) || (this.vel.x < 0 && this.go.dir > 0)) {
        return 'break';
      }

      return this.runAnimation(this.go.distance);
    }

    return 'idle';
  }

  turbo(turboOn: boolean) {
    this.go.dragFactor = turboOn ? FAST_DRAG : SLOW_DRAG;
  }

  draw(context: CanvasRenderingContext2D) {
    this.sprite.draw(this.routeFrame(), context, 0, 0, this.go.heading < 0);
  }
}
