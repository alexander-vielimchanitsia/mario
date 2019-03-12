import Camera from "./Camera";

export default class Compositor {
  layers: ((context: CanvasRenderingContext2D, camera: Camera) => void)[];

  constructor() {
    this.layers = [];
  }

  draw(context: CanvasRenderingContext2D, camera: Camera) {
    this.layers.forEach(layer => {
      layer(context, camera);
    });
  }
}
