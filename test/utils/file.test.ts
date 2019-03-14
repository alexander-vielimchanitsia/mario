import 'mocha';
import {expect} from 'chai';

import { file } from '../../src/js/utils/file';

const TEST_FILE_PATH = '/test/data/1-1.txt';
const LINES_NUM = 13;
const LINES: {[num: number]: string} = {
  0: '',
  1: '',
  2: '                      ?',
  3: '',
  4: '',
  5: '',
  6: '                ?   %?%?%',
  7: '                                   ||',
  8: '                             ||    ||',
  9: '    M                        ||    ||',
 10: '#################################################',
 11: '#################################################',
 12: '',
};


describe('Test `utils.file`', () => {
  it('check `file.open` initialization', async () => {
    const f = await file.open(TEST_FILE_PATH);
    expect(f.length).equal(269);
  });
  it('read all lines with help `file.readLine`', async () => {
    const f = await file.open(TEST_FILE_PATH);
    for (let lineNum = 0; lineNum < LINES_NUM; lineNum++) {
      const line = f.readLine();
      expect(line).equal(LINES[lineNum]);
    }
  });
  it('`file.readLine` has to not allow read out of file space', async () => {
    const f = await file.open(TEST_FILE_PATH);
    // set the word point out of file
    f.seek(f.length);
    f.readLine();
    // test the case
    const line = f.readLine();
    expect(line).null;
  });
});
