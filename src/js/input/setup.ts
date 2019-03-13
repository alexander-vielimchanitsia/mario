import { Mario } from "../entities/Mario";
import { Keyboard } from './Keyboard';

export function setupKeyboard(mario: Mario) {
  const input = new Keyboard();

  input.addMapping('KeyP', (keyState: number) => {
    if (keyState)
      mario.jump.start();
    else
      mario.jump.cancel();
  });

  input.addMapping('KeyO', (keyState: number) => {
    mario.turbo(!!keyState);
  });

  input.addMapping('KeyD', (keyState: number) => {
    mario.go.dir += keyState ? 1 : -1;
  });

  input.addMapping('KeyA', (keyState: number) => {
    mario.go.dir += keyState ? -1 : 1;
  });

  return input;
}
