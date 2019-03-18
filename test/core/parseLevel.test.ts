import 'mocha';
import {expect} from 'chai';
import { identifySprite, getTile, mapToMatrix, parseLevel, setTile, MAP_END, PATTERNS } from '../../src/js/parseLevel';

// TODO: does it make sense to automate the test cases? :-/
// TODO: like to have an object of specified test cases, and only one function to test (iterating by the object)
describe('Test parseLevel.identifySprite', () => {
  describe('with pattern requiring "||\\n||" as the minimum, without lines count limit', () => {
    //VALID
    it('map="||\\n||" - should return return path to "||\\n||"', () => {
      const map = '||\n||';
      const matrix = mapToMatrix(map);
      const x = 0;
      const y = 0;
      const res = identifySprite(matrix, '|', PATTERNS['|'], x, y);
      expect(res).to.eql({startX: x, endX: 1, startY: y, endY: 1});
    });
    it('map="\\n||\\n|||" - should return return path to "||\\n||"', () => {
      const map = '\n||\n|||';
      const matrix = mapToMatrix(map);
      const x = 0;
      const y = 1;
      const res = identifySprite(matrix, '|', PATTERNS['|'], x, y);
      expect(res).to.eql({startX: x, endX: 1, startY: y, endY: 2});
    });
    it('map="||\\n||\\n||" - should return return path to "||\\n||\\n||"', () => {
      const map = '||\n||\n||';
      const matrix = mapToMatrix(map);
      const x = 0;
      const y = 0;
      const res = identifySprite(matrix, '|', PATTERNS['|'], x, y);
      expect(res).to.eql({startX: x, endX: 1, startY: y, endY: 2});
    });
    it('map="|||\\n|||" - should return return path to "||\\n||"', () => {
      const map = '|||\n|||';
      const matrix = mapToMatrix(map);
      const x = 0;
      const y = 0;
      const res = identifySprite(matrix, '|', PATTERNS['|'], x, y);
      expect(res).to.eql({startX: x, endX: 1, startY: y, endY: 1});
    });
    it('map="#" - should return return path to "#"', () => {
      const map = '#';
      const matrix = mapToMatrix(map);
      const x = 0;
      const y = 0;
      const res = identifySprite(matrix, '#', PATTERNS['#'], x, y);
      expect(res).to.eql({startX: x, endX: x, startY: y, endY: y});
    });


    //INVALID
    it('map="|" - should return return undefined', () => {
      const map = '|';
      const matrix = mapToMatrix(map);
      const x = 0;
      const y = 0;
      const res = identifySprite(matrix, '|', PATTERNS['|'], x, y);
      expect(res).to.undefined;
    });
    it('map="||" - should return return undefined', () => {
      const map = '||';
      const matrix = mapToMatrix(map);
      const x = 0;
      const y = 0;
      const res = identifySprite(matrix, '|', PATTERNS['|'], x, y);
      expect(res).to.undefined;
    });
    it('map="|\\n|" - should return return undefined', () => {
      const map = '|\n|';
      const matrix = mapToMatrix(map);
      const x = 0;
      const y = 0;
      const res = identifySprite(matrix, '|', PATTERNS['|'], x, y);
      expect(res).to.undefined;
    });
    it('map="||\\n|" - should return return undefined', () => {
      const map = '||\n|';
      const matrix = mapToMatrix(map);
      const x = 0;
      const y = 0;
      const res = identifySprite(matrix, '|', PATTERNS['|'], x, y);
      expect(res).to.undefined;
    });
    it('map="|\\n||" - should return return undefined', () => {
      const map = '|\n||';
      const matrix = mapToMatrix(map);
      const x = 0;
      const y = 0;
      const res = identifySprite(matrix, '|', PATTERNS['|'], x, y);
      expect(res).to.undefined;
    });
    it('map="|\\n |" - should return return undefined', () => {
      const map = '|\n |';
      const matrix = mapToMatrix(map);
      const x = 0;
      const y = 0;
      const res = identifySprite(matrix, '|', PATTERNS['|'], x, y);
      expect(res).to.undefined;
    });
  });
});

describe('Test parseLevel.getTile', () => {
  it('find by direct address', () => {
    expect(getTile('|', PATTERNS['|'], 0, 0)).to.eql(PATTERNS['|'].tiles['0:0']);
    expect(getTile('|', PATTERNS['|'], 1, 0)).to.eql(PATTERNS['|'].tiles['1:0']);
  });
  it('find by direct x and any y address', () => {
    expect(getTile('|', PATTERNS['|'], 0, 3)).to.eql(PATTERNS['|'].tiles['0:y']);
    expect(getTile('|', PATTERNS['|'], 1, 5)).to.eql(PATTERNS['|'].tiles['1:y']);
  });
  it('try to find a nonexistent tile', () => {
    expect(getTile('|', PATTERNS['|'], 2, 2)).to.undefined;
  });
});

describe('Test parseLevel.setTile', () => {
  it('map="||\\n||" - set tiles of "|" pattern', () => {
    const map = '||\n||';
    const matrix = mapToMatrix(map);
    const res = setTile(matrix, 0, 0);
    expect(res).to.eql({x: 2, y: 0});
  });
  it('map="#" - set tile of "#" pattern', () => {
    const map = '#';
    const matrix = mapToMatrix(map);
    const res = setTile(matrix, 0, 0);
    expect(res).to.eql({x: 1, y: 0});
  });
});

describe('Test parseLevel.parseLevel', () => {
  it('empty map - should return only MAP_END symbol', () => {
    const level = parseLevel('');
    expect(level.grid).to.eql([[MAP_END]]);
  });
  it('map="#"', () => {
    const map = '#';
    const level = parseLevel(map);
    expect(level.get(0, 0)).to.eql(PATTERNS['#'].tiles['0:0']);
    expect(level.get(1, 0)).to.equal(MAP_END);
  });
  it('map="||\\n||"', () => {
    const map = '||\n||';
    const level = parseLevel(map);
    expect(level.get(0, 0)).to.eql(PATTERNS['|'].tiles['0:0']);
    expect(level.get(1, 0)).to.eql(PATTERNS['|'].tiles['1:0']);
    expect(level.get(0, 1)).to.eql(PATTERNS['|'].tiles['0:y']);
    expect(level.get(1, 1)).to.eql(PATTERNS['|'].tiles['1:y']);
  });
});
