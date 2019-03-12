import {Vector2} from './math';

export default class Camera {
  pos: Vector2;
  size: Vector2;

  constructor() {
    this.pos = new Vector2(0, 0);
    this.size = new Vector2(256, 224);
  }
}
