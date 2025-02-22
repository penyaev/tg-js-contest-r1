import {
  isCR, isLF, isSpace, isTab,
} from './chars';
import { Line } from './line';

export class Lines {
  private rpos = 0;

  private input: string[];

  constructor(input: string) {
    this.input = [...input];
  }

  public eof(): boolean {
    return this.rpos >= this.input.length;
  }

  public next(): Line {
    const start = this.rpos;
    let blank = true;
    let lineEndingLen = 0;
    while (this.rpos < this.input.length) {
      /**
       * For security reasons, the Unicode character U+0000
       * must be replaced with the REPLACEMENT CHARACTER (U+FFFD).
       */
      if (this.input[this.rpos] === '\u0000') {
        this.input[this.rpos] = '\uFFFD';
      }

      const char = this.input[this.rpos];
      const nextChar = this.rpos + 1 < this.input.length ? this.input[this.rpos + 1] : undefined;

      // A line ending is a line feed (U+000A)...
      if (isLF(char)) {
        lineEndingLen = 1;
      }

      // ...a carriage return (U+000D) not followed by a line feed
      if (isCR(char) && (nextChar === undefined || !isLF(nextChar))) {
        lineEndingLen = 1;
      }

      // ...or a carriage return and a following line feed.
      if (isCR(char) && (nextChar !== undefined && isLF(nextChar))) {
        lineEndingLen = 2;
      }

      if (lineEndingLen > 0) {
        this.rpos += lineEndingLen;
        break;
      }

      // A line containing no characters, or a line containing only spaces (U+0020) or tabs (U+0009),
      // is called a blank line.
      if (!isSpace(char) && !isTab(char)) {
        // blank = false;
      }

      this.rpos++;
    }

    return new Line(this.input.slice(start, this.rpos - lineEndingLen));
  }
}
