import { PlayerEnv } from '../Level';
import { Font } from "../loaders/font";

export function createDashboardLayer(font: Font, playerEnv: PlayerEnv) {
  const LINE1 = font.size;
  const LINE2 = font.size * 2;

  const coins = 0;
  const lives = 3;

  return function drawDashboard(context: CanvasRenderingContext2D) {
    const {score, time} = playerEnv.playerController;

    font.print('MARIO', context, 8, LINE1);
    font.print(score.toString().padStart(6, '0'), context, 8, LINE2);

    font.print('@x' + coins.toString().padStart(2, '0'), context, 67, LINE2);

    font.print('WORLD', context, 112, LINE1);
    font.print('1-1', context, 120, LINE2);

    font.print('TIME', context, 164, LINE1);
    font.print(time.toFixed().toString().padStart(3, '0'), context, 172, LINE2);

    font.print('LIVES', context, 208, LINE1);
    font.print(lives.toString(), context, 224, LINE2);
  };
}
