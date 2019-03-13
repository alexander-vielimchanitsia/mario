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

  // Traits
  // =========================
  public physics = new Physics(this);
  public solid = new Solid(this);
  public go = new Go(this);
  public jump = new Jump(this);
  public killable = new Killable(this);
  public stomper = new Stomper(this);
  // =========================

  constructor(sprite: SpriteSheet) {
    super(sprite);
    this.size.set(14, 16);
    this.killable.removeAfter = 0;
    this.runAnimation = sprite.animations.get('run');
    this.turbo(false);
  }

  static async loadSprite() {
    return loadSpriteSheet('mario');
  }

  get currentSpriteName(): string {
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
    this.sprite.draw(this.currentSpriteName, context, 0, 0, this.go.heading < 0);
  }
}
