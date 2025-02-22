import type { Config } from './config';

import { Line } from './line';

export enum TokenType {
  UNKNOWN = 'unknown',
  TEXT = 'text',
  BACKTICK_STRING = 'backtick_string',
  BOLD_DELIM_RUN = 'bold_delim_run',
  ITALIC_DELIM_RUN = 'italic_delim_run',
  STRIKETHROUGH_DELIM_RUN = 'strikethrough_delim_run',
  SPOILER_DELIM_RUN = 'spoiler_delim_run',
  LINK_BOUNDARY = 'link_boundary',
  LINK_MIDDLE = 'link_middle',
  POINTY_BRACKET = 'pointy_bracket',
}
export type Token = {
  type: TokenType;
  pos: number;
  s: string;
  left: boolean;
  right: boolean;
};

export class InlineLexer {
  private line: Line;

  constructor(s: string, private config: Config) {
    this.line = new Line([...s]);
  }

  private tryParseBacktickString(): Token {
    const pos = this.line.pos();
    const s = this.line.consume('`', 1, Infinity).join('');
    return {
      type: TokenType.BACKTICK_STRING,
      pos,
      s,
      left: true, // code spans are always left- and right- flanking (test 327)
      right: true,
    };
  }

  private tryParseLinkBoundaryLeft(): Token {
    const pos = this.line.pos();
    const s = this.line.consume('[', 1, 1).join('');
    return {
      type: TokenType.LINK_BOUNDARY,
      pos,
      s,
      left: true,
      right: false,
    };
  }

  private tryParseLinkBoundaryRight(): Token {
    const pos = this.line.pos();
    const s = this.line.consume(')', 1, 1).join('');
    return {
      type: TokenType.LINK_BOUNDARY,
      pos,
      s,
      left: false,
      right: true,
    };
  }

  private tryParsePointyBracketLeft(): Token {
    const pos = this.line.pos();
    const lt = this.config.escapedGtLt ? ['&', 'l', 't', ';'] : ['<'];
    const s = this.line.consumeMultiAll(lt).join('');
    return {
      type: TokenType.POINTY_BRACKET,
      pos,
      s,
      left: true,
      right: false,
    };
  }

  private tryParsePointyBracketRight(): Token {
    const pos = this.line.pos();
    const gt = this.config.escapedGtLt ? ['&', 'g', 't', ';'] : ['>'];
    const s = this.line.consumeMultiAll(gt).join('');
    return {
      type: TokenType.POINTY_BRACKET,
      pos,
      s,
      left: false,
      right: true,
    };
  }

  private tryParseLinkMiddle(): Token {
    const pos = this.line.pos();
    this.line.consume(']', 1, 1);
    this.line.consume('(', 1, 1);
    return {
      type: TokenType.LINK_MIDDLE,
      pos,
      s: '](',
      left: false,
      right: false,
    };
  }

  private tryParseDelimiterRun(type: TokenType, delimiter: string): Token {
    const pos = this.line.pos();
    const left = this.line.leftFlanking();
    const s = this.line.consume(delimiter, 2, 2).join('');
    const right = this.line.rightFlanking();
    return {
      type,
      pos,
      s,
      left,
      right,
    };
  }

  private readonly tokenParsers = [
    this.tryParseBacktickString.bind(this),
    this.tryParseDelimiterRun.bind(this, TokenType.BOLD_DELIM_RUN, '*'),
    this.tryParseDelimiterRun.bind(this, TokenType.ITALIC_DELIM_RUN, '_'),
    this.tryParseDelimiterRun.bind(this, TokenType.STRIKETHROUGH_DELIM_RUN, '~'),
    this.tryParseDelimiterRun.bind(this, TokenType.SPOILER_DELIM_RUN, '|'),
    this.tryParseLinkBoundaryLeft.bind(this),
    this.tryParseLinkBoundaryRight.bind(this),
    this.tryParseLinkMiddle.bind(this),
    this.tryParsePointyBracketLeft.bind(this),
    this.tryParsePointyBracketRight.bind(this),
  ];

  public next(): Token | undefined {
    let token: Token | undefined;
    let textToken: Token | undefined;

    while (!this.line.eol()) {
      for (const parser of this.tokenParsers) {
        try {
          this.line.save();

          token = parser();
        } catch {
          this.line.restore();
        }

        if (token) {
          if (textToken) {
            this.line.restore();
            return textToken;
          }
          return token;
        }
      }

      if (!textToken) {
        textToken = {
          type: TokenType.TEXT,
          pos: this.line.pos(),
          s: '',
          left: false,
          right: false,
        };
      }
      textToken.s += this.line.consumeAny(1, 1).join('');
    }

    return textToken;
  }
}
