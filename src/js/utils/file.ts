
export class file {
  private _text: string;
  private _wordp: number;

  public length: number;

  constructor(public path: string) {}

  /**
   * read text from specified path and return `file` object to manipulate with it
   * @param {string} path
   * @returns {Promise<file>}
   */
  static async open(path: string): Promise<file> {
    const f = new file(path);
    const response = await fetch(path);
    f._text = await response.text();
    f._wordp = 0;
    f.length = f._text.length;
    return f;
  }

  public seek(p: number) {
    if (p < 0 || p > this.length) {
      throw new Error('Tried to get access out of the file');
    }
    this._wordp = p;
  }

  public readLine(): string | null {
    if (this._wordp < 0 || this._wordp > this.length) {
      console.warn('Tried to read out of the file');
      return null;
    }
    let line = '';
    while (this._wordp < this.length && this._text[this._wordp] != '\n') {
      line += this._text[this._wordp++];
    }
    this._wordp++;
    return line;
  }

}
