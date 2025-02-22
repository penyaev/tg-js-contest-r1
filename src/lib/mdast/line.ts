import {
  isCR, isLF, isSpace, isTab, isUnicodePunctuation,
} from './chars';

type LineState = {
  rpos: number;
  repos: number;
};

class ConsumptionFailed extends Error {
}

export class Line {
  private states: LineState[];

  constructor(public cps: string[]) {
    this.states = [{
      rpos: 0,
      repos: this.cps.length,
    }];
  }

  public eol(): boolean {
    return this.state().rpos >= this.state().repos;
  }

  private state(): LineState {
    return this.states[this.states.length - 1];
  }

  public pos() {
    return this.state().rpos;
  }

  public length() {
    return this.state().repos - this.state().rpos;
  }

  public save(): number {
    this.states.push({ ...this.state() });
    return this.states.length - 1;
  }

  public restore(n?: number) {
    if (n === undefined) {
      n = this.states.length - 1;
    }
    while (this.states.length > n) {
      this.states.pop();
    }
  }

  public consumeAny(min: number, max: number): string[] {
    const consumed = [];
    while (!this.eol() && consumed.length < max) {
      consumed.push(this.peek());
      this.state().rpos++;
    }
    if (consumed.length < min) {
      throw new ConsumptionFailed();
    }
    return consumed;
  }

  public consumeMulti(cs: string[], min: number, max: number): string[] {
    const consumed = [];
    while (cs.includes(this.peek()) && !this.eol() && consumed.length < max) {
      consumed.push(this.peek());
      this.state().rpos++;
    }
    if (consumed.length < min) {
      throw new ConsumptionFailed();
    }
    return consumed;
  }

  public consumeMultiAll(cs: string[]): string[] {
    const consumed = [];
    for (const c of cs) {
      consumed.push(...this.consume(c, 1, 1));
    }
    return consumed;
  }

  public consumeTrailingMulti(cs: string[], min: number, max: number): string[] {
    const consumed = [];
    while (cs.includes(this.peekTrailing()) && !this.eol() && consumed.length < max) {
      consumed.push(this.peekTrailing());
      this.state().repos--;
    }
    if (consumed.length < min) {
      throw new ConsumptionFailed();
    }
    return consumed;
  }

  public consume(cs: string, min: number, max: number): string[] {
    return this.consumeMulti([cs], min, max);
  }

  public consumeTrailing(cs: string, min: number, max: number): string[] {
    return this.consumeTrailingMulti([cs], min, max);
  }

  public consumeSpace(min: number, max: number) {
    return this.consume('\u0020', min, max);
  }

  public consumeTrailingSpace(min: number, max: number) {
    return this.consumeTrailing('\u0020', min, max);
  }

  public consumeSpaceOrTab(min: number, max: number) {
    return this.consumeMulti(['\u0020', '\u0009'], min, max);
  }

  public consumeTrailingSpaceOrTab(min: number, max: number) {
    return this.consumeTrailingMulti(['\u0020', '\u0009'], min, max);
  }

  public assertEol() {
    if (!this.eol()) {
      throw new Error('eol expected');
    }
  }

  private peek(): string {
    if (this.eol()) {
      return '';
    }

    return this.cps[this.state().rpos];
  }

  private peekBack(): string {
    const i = this.state().rpos;
    if (i > 0) {
      return this.cps[i - 1];
    }
    return '';
  }

  private peekTrailing(): string {
    if (this.eol()) {
      return '';
    }

    return this.cps[this.state().repos - 1];
  }

  public leftFlanking(): boolean {
    const next = this.peekBack();
    return next === '' || isTab(next) || isSpace(next) || isUnicodePunctuation(next) || isCR(next) || isLF(next);
  }

  public rightFlanking(): boolean {
    const next = this.peek();
    return next === '' || isTab(next) || isSpace(next) || isUnicodePunctuation(next) || isCR(next) || isLF(next);
  }

  public consumeAll(): string {
    const result = this.cps.slice(this.state().rpos, this.state().repos).join('');
    this.state().rpos = this.state().repos;
    return result;
  }

  public string(): string {
    return this.cps.slice(this.state().rpos, this.state().repos).join('');
  }

  public blank(allowNewline: boolean = false): boolean {
    for (let i = this.state().rpos; i < this.state().repos; i++) {
      const isNewline = isCR(this.cps[i]) || isLF(this.cps[i]);
      const isBlank = isSpace(this.cps[i]) || isTab(this.cps[i]) || (isNewline && allowNewline);
      if (!isBlank) {
        return false;
      }
    }
    return true;
  }
}
