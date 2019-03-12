import { Side } from "../constants";
import { Entity } from "../entities/base";
import Level from "../Level";
import { TileResolverMatch } from "../typings/core";

export abstract class Trait {
  tasks: (() => void)[];

  // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
  constructor(entity: Entity) {
    entity.addTrait(this);
    this.tasks = [];
  }

  finalize() {
    this.tasks.forEach(task => task());
    this.tasks.length = 0;
  }

  queue(task: () => void) {
    this.tasks.push(task);
  }

  collides(us: Entity, them: Entity) {}
  obstruct(entity: Entity, side: Side, match: TileResolverMatch) {}
  update(entity: Entity, deltaTime: number, level: Level) {}
}
