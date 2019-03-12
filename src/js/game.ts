import '../css/main.css';

import Camera from './Camera';
import { Entity } from './entities/base';
import { Mario } from "./entities/Mario";
import { setupKeyboard } from './input/setup';
import { createCollisionLayer } from './layers/collision';
import { createDashboardLayer } from './layers/dashboard';
import { loadFont } from './loaders/font';
import { createLevelLoader } from './loaders/level';
import Timer from './Timer';
import PlayerController from './traits/PlayerController';

export class PlayerEnv extends Entity {
  playerController: PlayerController;

  constructor(playerEntity: Mario) {
    super(null);
    this.playerController = new PlayerController(this);
    this.playerController.checkpoint.set(64, 64);
    this.playerController.setPlayer(playerEntity);
  }
}

// TODO: audio: http://www.mariouniverse.com/wp-content/audio/sfx/smb/

class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor(canvasId='screen') {
    this.canvas = <HTMLCanvasElement>document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    // this.qualitySetup();
    // noinspection JSIgnoredPromiseFromCall
    this.start();
  }

  async start() {
    const loadLevel = await createLevelLoader();
    const level = await loadLevel('1-1');

    const camera = new Camera();

    const mario = new Mario(await Mario.loadSprite());

    const playerEnv = new PlayerEnv(mario);
    level.entities.add(playerEnv);


    level.comp.layers.push(createCollisionLayer(level));
    level.comp.layers.push(createDashboardLayer(await loadFont(), playerEnv));

    const input = setupKeyboard(mario);
    input.listenTo(window);

    const timer = new Timer(1/60);
    timer.update = (deltaTime) => {
      level.update(deltaTime);
      camera.pos.x = Math.max(0, mario.pos.x - 100);
      level.comp.draw(this.ctx, camera);
    };

    timer.start();
  }

  // qualitySetup() {
  //   const devicePixelRatio = window.devicePixelRatio || 1;
  //   // noinspection JSUnresolvedVariable
  //   const backingStoreRatio = this.ctx.webkitBackingStorePixelRatio
  //                          || this.ctx.mozBackingStorePixelRatio
  //                          || this.ctx.msBackingStorePixelRatio
  //                          || this.ctx.oBackingStorePixelRatio
  //                          || this.ctx.backingStorePixelRatio
  //                          || 1;
  //   const ratio = devicePixelRatio / backingStoreRatio;
  //   const width = this.canvas.width;
  //   const height = this.canvas.height;
  //   this.canvas.width = width * ratio;
  //   this.canvas.height = height * ratio;
  //   this.canvas.style.width = width + 'px';
  //   this.canvas.style.height = height + 'px';
  //   this.ctx.scale(ratio, ratio);
  // }
}

window.addEventListener('DOMContentLoaded', () => {
  new Game();
});
