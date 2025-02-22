import type { Config } from '../config';

import { Line } from '../line';

export enum NodeType {
  UNKNOWN = 'unknown',
  DOCUMENT = 'document',
  BLOCK_QUOTE = 'block_quote',
  RAW = 'raw',
  TEXT = 'text',
  THEMATIC_BREAK = 'thematic_break',
  ATX_HEADING = 'atx_heading',
  PARAGRAPH = 'paragraph',
  INDENTED_CODE_BLOCK = 'indented_code_block',
  FENCED_CODE_BLOCK = 'fenced_code_block',

  EMPH = 'emph',
  CODE_SPAN = 'code_span',
  LINK = 'link',
}

export enum EmphType {
  UNKNOWN = 'unknown',
  BOLD = 'bold',
  ITALIC = 'italic',
  STRIKETHROUGH = 'strikethrough',
  SPOILER = 'spoiler',
}
export class Node {
  public readonly type: NodeType;

  public readonly children: Node[] = [];

  public parent: Node | undefined = undefined;

  constructor(type: NodeType) {
    this.type = type;
  }

  public addChild(node: Node) {
    node.parent = this;
    this.children.push(node);
  }

  public close() {
  }
}

export class FencedCodeBlockNode extends Node {
  constructor(
    public fenceType: string,
    public fenceLen: number,
    public infoString: string,
    public fenceIndentation: number,
  ) {
    super(NodeType.FENCED_CODE_BLOCK);
  }
}

export class AtxHeadingNode extends Node {
  constructor(
    public level: number,
  ) {
    super(NodeType.ATX_HEADING);
  }
}

export class TextNode extends Node {
  constructor(
    public text: string,
  ) {
    super(NodeType.TEXT);
  }
}

export class RawNode extends Node {
  constructor(
    public raw: string,
  ) {
    super(NodeType.RAW);
  }
}

export class IndentedCodeBlockNode extends Node {
  constructor(
  ) {
    super(NodeType.INDENTED_CODE_BLOCK);
  }

  public close() {
    super.close();

    // remove empty lines from the top (test 117)
    while (this.children.length) {
      const node = this.children[0] as TextNode;
      if (new Line([...node.text]).blank(true)) {
        this.children.shift();
      } else {
        break;
      }
    }

    // remove empty lines from the bottom (test 117)
    while (this.children.length) {
      const node = this.children[this.children.length - 1] as TextNode;
      if (new Line([...node.text]).blank(true)) {
        this.children.pop();
      } else {
        break;
      }
    }
  }
}

export class EmphNode extends Node {
  constructor(
    public emphType: EmphType,
    private config: Config,
  ) {
    super(NodeType.EMPH);
  }

  public tag(): string {
    switch (this.emphType) {
      case EmphType.BOLD: return 'b';
      case EmphType.ITALIC: return 'i';
      case EmphType.STRIKETHROUGH: return 's';
      case EmphType.SPOILER: return 'span';
      default: throw new Error(`do not know what tag has emph type ${this.emphType}`);
    }
  }

  public attr(): string {
    switch (this.emphType) {
      case EmphType.SPOILER: return this.config.spoilerSpanAttr;
      default: return '';
    }
  }
}

export class CodeSpanNode extends Node {
  constructor(
    public backticks: number,
  ) {
    super(NodeType.CODE_SPAN);
  }

  public close() {
    super.close();

    let spacesOnly = true;
    let beginsWithSpace = false;
    let endsWithSpace = false;

    // As per https://spec.commonmark.org/0.31.2/#code-spans
    // First, line endings are converted to spaces.
    this.children.forEach((node, i) => {
      if (node.type === NodeType.TEXT) {
        const n = node as TextNode;

        n.text = n.text.replaceAll('\n', ' ');

        if (i === 0 && n.text.length > 0 && n.text[0] === ' ') {
          beginsWithSpace = true;
        }
        if (i === this.children.length - 1 && n.text.length > 0 && n.text[n.text.length - 1] === ' ') {
          endsWithSpace = true;
        }

        const usedChars = new Set([...n.text]);
        spacesOnly = spacesOnly && (usedChars.has(' ') && usedChars.size === 1);
      } else {
        spacesOnly = false;
      }
    });

    // If the resulting string both begins and ends with a space character, but does not consist entirely of
    // space characters, a single space character is removed from the front and back.
    // (test 329)
    if (!spacesOnly && beginsWithSpace && endsWithSpace) {
      const firstChild = (this.children[0] as TextNode);
      firstChild.text = firstChild.text.slice(1);

      const lastChild = (this.children[this.children.length - 1] as TextNode);
      lastChild.text = lastChild.text.slice(0, lastChild.text.length - 1);
    }
  }
}

export enum LinkType {
  NORMAL = 'normal', // [title](https://google.com)
  AUTOLINK = 'autolink', // <https://google.com>
}
export class LinkNode extends Node {
  constructor(
    public linkType: LinkType,
    public destination: string,
  ) {
    super(NodeType.LINK);
  }
}
