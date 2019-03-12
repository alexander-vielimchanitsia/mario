
export interface ISpriteSpec {
  readonly imageURL: string;
  readonly frames: IFrameSpriteSpec[];
  readonly animations: IAnimationSpriteSpec[];
  readonly tileW: number;
  readonly tileH: number;
  readonly tiles: ITileSpriteSpec;
}

export interface IFrameSpriteSpec {
  readonly name: string;
  readonly rect: number[];
}

export interface IAnimationSpriteSpec {
  readonly name: string;
  readonly frameLen: number;
  readonly frames: string[];
}

export interface ITileSpriteSpec {
  readonly name: string;
  readonly index: number[];
}
