import 'mocha';
import {expect} from 'chai';
import { Vector2 } from "../src/js/math";

describe('Test `math.Vector2`', () => {
  it('check initialization', () => {
    const x = 10;
    const y = 15;
    const vec = new Vector2(x, y);
    expect(vec.x).equal(x);
    expect(vec.y).equal(y);
  });
  it('set the properties with help `set` method', () => {
    const x = 10;
    const y = 15;
    const vec = new Vector2(0, 0);
    vec.set(x, y);
    expect(vec.x).equal(x);
    expect(vec.y).equal(y);
  });
});
