
export function createAnimation(frames: string[], frameLen: number) {
  return function resolveFrame(distance: number) {
    const frameIndex = Math.floor(distance / frameLen) % frames.length;
    return frames[frameIndex];
  };
}
