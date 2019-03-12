
export interface ILevelSpec {
  readonly spriteSheet: string;
  readonly patterns: IPatternsLevelSpec;
  readonly layers: ILayerLevelSpec[];
  readonly entities: IEntityLevelSpec[];
}

export interface ILayerLevelSpec {
  readonly tiles: ITileLevelSpec[];
}

export interface IPatternsLevelSpec {
  readonly [name: string]: IPatternLevelSpec;
}
export interface IPatternLevelSpec {
  readonly tiles: ITileLevelSpec[];
}

export interface ITileLevelSpec {
  readonly name: string;
  readonly pattern?: string;
  readonly type?: string;
  readonly ranges: number[][];
}

export interface IEntityLevelSpec {
  readonly name: string;
  readonly pos: number[];
}
