import Camera from "./Camera";

export default class Compositor {
  layers: ((context: CanvasRenderingContext2D, camera: Camera) => void)[];

  constructor() {
    this.layers = [];
  }

  draw(context: CanvasRenderingContext2D, camera: Camera) {
    for (const layer of this.layers) {
      layer(context, camera);
    }
  }
}
