import 'mocha';
import {expect} from 'chai';
import { findAllAdjoiningTiles, getTile, mapToMatrix, parseLevel, setTile } from '../../src/js/parseLevel';
import { IPattern } from '../../src/js/typings/level';

const PATTERN: IPattern = {
  'maxX': 2,
  'minX': 2,
  'maxY': Number.POSITIVE_INFINITY,
  'minY': 2,
  'tiles': {
    '0:0': {'name': 'pipe-insert-vert-left', 'type': 'ground'},
    '1:0': {'name': 'pipe-insert-vert-right', 'type': 'ground'},
    '0:y': {'name': 'pipe-vert-left', 'type': 'ground'},
    '1:y': {'name': 'pipe-vert-right', 'type': 'ground'},
  },
};

// TODO: does it make sense to automate the test cases? :-/
// TODO: like to have an object of specified test cases, and only one function to test (iterating by the object)
describe('Test parseLevel.findAllAdjoiningTiles', () => {
  describe('with pattern requiring "||\\n||" as the minimum, without lines count limit', () => {
    //VALID
    it('map="||\\n||" - should return return path to "||\\n||"', () => {
      const map = '||\n||';
      const matrix = mapToMatrix(map);
      const x = 0;
      const y = 0;
      const res = findAllAdjoiningTiles(matrix, '|', PATTERN, x, y);
      expect(res).to.eql({startX: x, endX: 1, startY: y, endY: 1});
    });
    it('map="\\n||\\n|||" - should return return path to "||\\n||"', () => {
      const map = '\n||\n|||';
      const matrix = mapToMatrix(map);
      const x = 0;
      const y = 1;
      const res = findAllAdjoiningTiles(matrix, '|', PATTERN, x, y);
      expect(res).to.eql({startX: x, endX: 1, startY: y, endY: 2});
    });
    it('map="||\\n||\\n||" - should return return path to "||\\n||\\n||"', () => {
      const map = '||\n||\n||';
      const matrix = mapToMatrix(map);
      const x = 0;
      const y = 0;
      const res = findAllAdjoiningTiles(matrix, '|', PATTERN, x, y);
      expect(res).to.eql({startX: x, endX: 1, startY: y, endY: 2});
    });
    it('map="|||\\n|||" - should return return path to "||\\n||"', () => {
      const map = '|||\n|||';
      const matrix = mapToMatrix(map);
      const x = 0;
      const y = 0;
      const res = findAllAdjoiningTiles(matrix, '|', PATTERN, x, y);
      expect(res).to.eql({startX: x, endX: 1, startY: y, endY: 1});
    });

    //INVALID
    it('map="|" - should return return undefined', () => {
      const map = '|';
      const matrix = mapToMatrix(map);
      const x = 0;
      const y = 0;
      const res = findAllAdjoiningTiles(matrix, '|', PATTERN, x, y);
      expect(res).to.undefined;
    });
    it('map="||" - should return return undefined', () => {
      const map = '||';
      const matrix = mapToMatrix(map);
      const x = 0;
      const y = 0;
      const res = findAllAdjoiningTiles(matrix, '|', PATTERN, x, y);
      expect(res).to.undefined;
    });
    it('map="|\\n|" - should return return undefined', () => {
      const map = '|\n|';
      const matrix = mapToMatrix(map);
      const x = 0;
      const y = 0;
      const res = findAllAdjoiningTiles(matrix, '|', PATTERN, x, y);
      expect(res).to.undefined;
    });
    it('map="||\\n|" - should return return undefined', () => {
      const map = '||\n|';
      const matrix = mapToMatrix(map);
      const x = 0;
      const y = 0;
      const res = findAllAdjoiningTiles(matrix, '|', PATTERN, x, y);
      expect(res).to.undefined;
    });
    it('map="|\\n||" - should return return undefined', () => {
      const map = '|\n||';
      const matrix = mapToMatrix(map);
      const x = 0;
      const y = 0;
      const res = findAllAdjoiningTiles(matrix, '|', PATTERN, x, y);
      expect(res).to.undefined;
    });
    it('map="|\\n |" - should return return undefined', () => {
      const map = '|\n |';
      const matrix = mapToMatrix(map);
      const x = 0;
      const y = 0;
      const res = findAllAdjoiningTiles(matrix, '|', PATTERN, x, y);
      expect(res).to.undefined;
    });
  });
});

describe('Test parseLevel.getTile', () => {
  it('find by direct address', () => {
    expect(getTile('|', PATTERN, 0, 0)).to.eql(PATTERN.tiles['0:0']);
    expect(getTile('|', PATTERN, 1, 0)).to.eql(PATTERN.tiles['1:0']);
  });
  it('find by direct x and any y address', () => {
    expect(getTile('|', PATTERN, 0, 3)).to.eql(PATTERN.tiles['0:y']);
    expect(getTile('|', PATTERN, 1, 5)).to.eql(PATTERN.tiles['1:y']);
  });
  it('try to find a nonexistent tile', () => {
    expect(getTile('|', PATTERN, 2, 2)).to.undefined;
  });
});

describe('Test parseLevel.setTile', () => {
  it('map="||\\n||" - set tiles of "|" pattern', () => {
    const map = '||\n||';
    const matrix = mapToMatrix(map);
    const res = setTile(matrix, 0, 0);
    expect(res).to.eql({x: 2, y: 0});
  });
});

describe('Test parseLevel.parseLevel', () => {
  it('map="||\\n||"', () => {
    const map = '||\n||';
    const level = parseLevel(map);
    expect(level.get(0, 0)).to.eql(PATTERN.tiles['0:0']);
    expect(level.get(1, 0)).to.eql(PATTERN.tiles['1:0']);
    expect(level.get(0, 1)).to.eql(PATTERN.tiles['0:y']);
    expect(level.get(1, 1)).to.eql(PATTERN.tiles['1:y']);
  });
});
