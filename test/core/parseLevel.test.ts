import 'mocha';
import {expect} from 'chai';
import { findAllAdjoiningTiles, IPattern, parseLevel } from '../../src/js/parseLevel';

const PATTERN: IPattern = {
  'maxX': 2,
  'minX': 2,
  'maxY': Number.POSITIVE_INFINITY,
  'minY': 2,
  'tiles': {
    '1:1': {'name': 'pipe-insert-vert-left', 'type': 'ground'},
    '2:1': {'name': 'pipe-insert-vert-right', 'type': 'ground'},
    '1:y': {'name': 'pipe-vert-left', 'type': 'ground'},
    '2:y': {'name': 'pipe-vert-right', 'type': 'ground'},
  },
};

// TODO: does it make sense to automate the test cases? :-/
// TODO: like to have an object of specified test cases, and only one function to test (iterating by the object)
describe('Test parseLevel.findAllAdjoiningTiles', () => {
  describe('with pattern requiring "||\\n||" as the minimum, without lines count limit', () => {
    //VALID
    it('map="||\\n||" - should return return path to "||\\n||"', () => {
      const map = '||\n||';
      const matrix = parseLevel(map);
      const x = 0;
      const y = 0;
      const res = findAllAdjoiningTiles(matrix, '|', PATTERN, x, y);
      expect(res).to.eql({startX: x, endX: 1, startY: y, endY: 1});
    });
    it('map="\\n||\\n|||" - should return return path to "||\\n||"', () => {
      const map = '\n||\n|||';
      const matrix = parseLevel(map);
      const x = 0;
      const y = 1;
      const res = findAllAdjoiningTiles(matrix, '|', PATTERN, x, y);
      expect(res).to.eql({startX: x, endX: 1, startY: y, endY: 2});
    });
    it('map="||\\n||\\n||" - should return return path to "||\\n||\\n||"', () => {
      const map = '||\n||\n||';
      const matrix = parseLevel(map);
      const x = 0;
      const y = 0;
      const res = findAllAdjoiningTiles(matrix, '|', PATTERN, x, y);
      expect(res).to.eql({startX: x, endX: 1, startY: y, endY: 2});
    });
    it('map="|||\\n|||" - should return return path to "||\\n||"', () => {
      const map = '|||\n|||';
      const matrix = parseLevel(map);
      const x = 0;
      const y = 0;
      const res = findAllAdjoiningTiles(matrix, '|', PATTERN, x, y);
      expect(res).to.eql({startX: x, endX: 1, startY: y, endY: 1});
    });

    //INVALID
    it('map="|" - should return return undefined', () => {
      const map = '|';
      const matrix = parseLevel(map);
      const x = 0;
      const y = 0;
      const res = findAllAdjoiningTiles(matrix, '|', PATTERN, x, y);
      expect(res).to.undefined;
    });
    it('map="||" - should return return undefined', () => {
      const map = '||';
      const matrix = parseLevel(map);
      const x = 0;
      const y = 0;
      const res = findAllAdjoiningTiles(matrix, '|', PATTERN, x, y);
      expect(res).to.undefined;
    });
    it('map="|\\n|" - should return return undefined', () => {
      const map = '|\n|';
      const matrix = parseLevel(map);
      const x = 0;
      const y = 0;
      const res = findAllAdjoiningTiles(matrix, '|', PATTERN, x, y);
      expect(res).to.undefined;
    });
    it('map="||\\n|" - should return return undefined', () => {
      const map = '||\n|';
      const matrix = parseLevel(map);
      const x = 0;
      const y = 0;
      const res = findAllAdjoiningTiles(matrix, '|', PATTERN, x, y);
      expect(res).to.undefined;
    });
    it('map="|\\n||" - should return return undefined', () => {
      const map = '|\n||';
      const matrix = parseLevel(map);
      const x = 0;
      const y = 0;
      const res = findAllAdjoiningTiles(matrix, '|', PATTERN, x, y);
      expect(res).to.undefined;
    });
    it('map="|\\n |" - should return return undefined', () => {
      const map = '|\n |';
      const matrix = parseLevel(map);
      const x = 0;
      const y = 0;
      const res = findAllAdjoiningTiles(matrix, '|', PATTERN, x, y);
      expect(res).to.undefined;
    });
  });
});
