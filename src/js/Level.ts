import EntityCollider from './collision/EntityCollider';
import TileCollider from './collision/TileCollider';
import Compositor from './Compositor';
import { Entity } from "./entities/base";
import { Matrix } from "./math";

export default class Level {
  gravity: number;
  totalTime: number;
  comp: Compositor;
  entities: Set<Entity>;
  entityCollider: EntityCollider;
  tileCollider: TileCollider;

  constructor() {
    this.gravity = 1500;
    this.totalTime = 0;

    this.comp = new Compositor();
    this.entities = new Set();

    this.entityCollider = new EntityCollider(this.entities);
    this.tileCollider = null;
  }

  setCollisionGrid(matrix: Matrix) {
    this.tileCollider = new TileCollider(matrix);
  }

  update(deltaTime: number) {
    for (const entity of this.entities)
      entity.update(deltaTime, this);
    for (const entity of this.entities)
      this.entityCollider.check(entity);
    for (const entity of this.entities)
      entity.finalize();
    this.totalTime += deltaTime;
  }
}
