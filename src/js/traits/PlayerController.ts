import { Entity } from "../entities/base";
import { Mario } from "../entities/Mario";
import Level from "../Level";
import { Vector2 } from '../math';
import { Trait } from "./base";

export default class PlayerController extends Trait {
  checkpoint: Vector2;
  player: Mario;
  score: number;
  time: number;

  constructor(entity: Entity) {
    super(entity);
    this.checkpoint = new Vector2(0, 0);
    this.player = null;
    this.score = 0;
    this.time = 300;
  }

  setPlayer(entity: Mario) {
    this.player = entity;
    this.player.stomper.onStomp = () => {
      this.score += 100;
    }
  }

  update(entity: Mario, deltaTime: number, level: Level) {
    if (!level.entities.has(this.player)) {
      this.player.killable.revive();
      this.player.pos.set(this.checkpoint.x, this.checkpoint.y);
      level.entities.add(this.player);
    } else {
      this.time -= deltaTime * 2;
    }
  }
}
