import { Entity } from "../entities/base";
import Level from "../Level";
import { Trait } from "./base";

export default class Physics extends Trait {
    update(entity: Entity, deltaTime: number, level: Level) {
        entity.pos.x += entity.vel.x * deltaTime;
        level.tileCollider.checkX(entity);

        entity.pos.y += entity.vel.y * deltaTime;
        level.tileCollider.checkY(entity);

        entity.vel.y += level.gravity * deltaTime;
    }
}
