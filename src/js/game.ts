import '../css/main.css';

import Camera from './Camera';
import { setupKeyboard } from './input/setup';
import { createDashboardLayer } from './layers/dashboard';
import { loadFont } from './loaders/font';
import { createLevelLoader } from './loaders/level';
import Timer from './Timer';

// TODO: audio: http://www.mariouniverse.com/wp-content/audio/sfx/smb/

class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor(canvasId='screen') {
    this.canvas = <HTMLCanvasElement>document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    // noinspection JSIgnoredPromiseFromCall
    this.start();
  }

  async start() {
    const loadLevel = await createLevelLoader();
    const level = await loadLevel('1-1');

    const camera = new Camera();

    level.comp.layers.push(createDashboardLayer(await loadFont(), level.playerEnv));

    const input = setupKeyboard(level.playerEnv.playerController.player);
    input.listenTo(window);

    const timer = new Timer(1/60);
    timer.update = (deltaTime) => {
      level.update(deltaTime);
      camera.update(level.playerEnv.playerController.player);
      level.comp.draw(this.ctx, camera);
    };

    timer.start();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new Game();
});
