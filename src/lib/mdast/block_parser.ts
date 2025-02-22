import type { Config } from './config';
import type { Line } from './line';

import { Document } from './ast/document';
import {
  AtxHeadingNode,
  FencedCodeBlockNode,
  IndentedCodeBlockNode,
  Node,
  NodeType,
  RawNode,
  TextNode,
} from './ast/node';
import { Lines } from './lines';

export class BlockParser {
  private document: Document;

  private lines: Lines;

  constructor(input: string, private config: Config) {
    this.document = new Document();
    this.lines = new Lines(input);
  }

  private tryParseAtxHeading(line: Line): Node | undefined {
    let checkpoint: number | undefined;
    try {
      checkpoint = line.save();
      line.consumeSpace(0, 3);
      const level = line.consume('#', 1, 6).length;

      try {
        line.save();
        line.consumeTrailingSpaceOrTab(0, Infinity);
        if (line.consumeTrailing('#', 0, Infinity).length > 0) {
          line.consumeTrailingSpaceOrTab(1, Infinity);
        }
      } catch {
        line.restore();
      }

      const node = new AtxHeadingNode(level);

      // if there's anything left, it has to be the heading content
      let content = '';
      try {
        line.save();
        line.consumeSpaceOrTab(1, Infinity);
        content = line.consumeAll();
        node.addChild(new RawNode(content));
      } catch {
        line.restore();
      }

      line.assertEol(); // make sure we consumed everything we had

      return node;
    } catch {
      line.restore(checkpoint);
    }

    return undefined;
  }

  private tryParseBlockQuote(line: Line): Node | undefined {
    try {
      line.save();
      line.consumeSpace(0, 3);
      if (this.config.escapedGtLt) {
        line.consume('&', 1, 1);
        line.consume('g', 1, 1);
        line.consume('t', 1, 1);
        line.consume(';', 1, 1);
      } else {
        line.consume('>', 1, 1);
      }
      line.consumeSpace(0, 1);

      return new Node(NodeType.BLOCK_QUOTE);
    } catch {
      line.restore();
    }

    return undefined;
  }

  private tryParseIndentedCodeBlock(line: Line): Node | undefined {
    try {
      line.save();
      line.consumeSpace(4, 4);

      const node = new IndentedCodeBlockNode();
      node.addChild(new TextNode(`${line.consumeAll()}\n`));

      return node;
    } catch {
      line.restore();
    }

    return undefined;
  }

  private tryParseOpeningFencedCodeBlock(line: Line): Node | undefined {
    const parent = this.document.findParent(NodeType.FENCED_CODE_BLOCK);
    if (parent !== undefined) {
      return undefined;
    }

    let fenceType: string | undefined;
    let fenceLength: number | undefined;
    let fenceIndentation: number | undefined;

    try {
      line.save();
      fenceIndentation = line.consumeSpace(0, 3).length;

      // try parsing either ~ or `
      // we'll restore if neither worked
      try {
        line.save();
        fenceLength = line.consume('`', 3, Infinity).length;
        fenceType = '`';
      } catch {
        line.restore();

        try {
          line.save();
          fenceLength = line.consume('~', 3, Infinity).length;
          fenceType = '~';
        } catch {
          line.restore();
        }
      }

      if (
        fenceLength === undefined
        || fenceType === undefined
      ) {
        throw new Error('could not parse neither ~ nor `');
      }

      const infoString = line.consumeAll();
      if (infoString.includes('`')) { // test 138
        throw new Error('info string cannot contain backticks');
      }
      return new FencedCodeBlockNode(fenceType, fenceLength, infoString, fenceIndentation);
    } catch {
      line.restore();
    }

    return undefined;
  }

  private tryCloseFencedCodeBlock(line: Line): boolean {
    if (this.document.currentType() !== NodeType.FENCED_CODE_BLOCK) {
      return false;
    }
    const parent = this.document.current as FencedCodeBlockNode;

    try {
      line.save();
      line.consumeSpace(0, 3);

      line.consume(parent.fenceType, parent.fenceLen, Infinity);
      line.consumeSpaceOrTab(0, Infinity);
      line.assertEol();

      this.document.close(); // close fenced code block
      return true;
    } catch {
      line.restore();
    }

    return false;
  }

  public parse(): Document {
    while (!this.lines.eof()) {
      const line = this.lines.next();

      let node: Node | undefined;
      let lineBlockQuoteNestingLevel = 0;
      do {
        // If a block quote is open, expect all lines to start with a '>', or close the block quote
        // one exception is lazy continuation: paragraphs within block quotes can be
        // continued without the leading '>'
        let blockQuoteLazyContinuation = false;
        if (this.document.findParent(NodeType.BLOCK_QUOTE) && lineBlockQuoteNestingLevel === 0) {
          node = this.tryParseBlockQuote(line);
          if (node !== undefined) {
            lineBlockQuoteNestingLevel++;

            // continue; // test 244
          } else {
            blockQuoteLazyContinuation = true;
          }
        }

        let fencedCodeBlock: FencedCodeBlockNode | undefined;
        if (this.document.currentType() === NodeType.FENCED_CODE_BLOCK) {
          fencedCodeBlock = this.document.current as FencedCodeBlockNode;
        }
        if (fencedCodeBlock === undefined) {
          node = this.tryParseOpeningFencedCodeBlock(line);
          if (node !== undefined) {
            this.document.closeUntilContainerBlock(blockQuoteLazyContinuation);
            this.document.openNode(node);
            continue;
          }
        } else if (this.tryCloseFencedCodeBlock(line)) {
          continue;
        } else if (!blockQuoteLazyContinuation) {
          line.consumeSpace(0, fencedCodeBlock.fenceIndentation);
          this.document.addNode(new TextNode(`${line.consumeAll()}\n`));
          continue;
        }

        if (this.config.enableHeaders) {
          node = this.tryParseAtxHeading(line);
          if (node !== undefined) {
            this.document.closeUntilContainerBlock(blockQuoteLazyContinuation);
            this.document.openNode(node);
            continue;
          }
        }

        // Open a new block quote if it's not open yet
        //
        // Telegram does not support nested block quotes at the moment,
        // so don't create more than one nested block quotes
        if (!this.document.findParent(NodeType.BLOCK_QUOTE)) {
          node = this.tryParseBlockQuote(line);
          if (node !== undefined) {
            // Open the block quote block because it's not open yet
            this.document.closeUntilContainerBlock(blockQuoteLazyContinuation);
            this.document.openNode(node);
            lineBlockQuoteNestingLevel++;
            continue;
          }
        }

        // An indented code block cannot interrupt a paragraph.
        if (this.document.currentType() !== NodeType.PARAGRAPH) {
          node = this.tryParseIndentedCodeBlock(line);
          if (node !== undefined) {
            // Open the indented code block if it's not open yet
            // Force opening a new node in case we're in the lazy continuation mode
            if (blockQuoteLazyContinuation || this.document.currentType() !== NodeType.INDENTED_CODE_BLOCK) {
              this.document.closeUntilContainerBlock(blockQuoteLazyContinuation);
              this.document.openNode(node);
            } else {
              this.document.addNodes(node.children);
            }
            continue;
          }
        }

        // handle blanks
        if (line.blank()) {
          if (this.document.currentType() === NodeType.PARAGRAPH) {
            line.consumeAll();
            this.document.close();
          }
          if (lineBlockQuoteNestingLevel === 0 && this.document.findParent(NodeType.BLOCK_QUOTE)) {
            line.consumeAll();
            this.document.closeUntilIncluding(NodeType.BLOCK_QUOTE);
          }
          if (this.document.currentType() === NodeType.INDENTED_CODE_BLOCK) {
            line.consumeAll();
            // lines with over 4 leading spaces have been handled above already
            // what's left here is only blank lines with less than 4 leading spaces
            this.document.addNode(new TextNode('\n'));
          }
          line.consumeAll();
          continue;
        }

        // If nothing else matched, then this is a paragraph (or a continuation of it)
        // Skip all leading tabs and spaces before adding content to a paragraph
        line.consumeSpaceOrTab(0, Infinity);
        if (this.document.currentType() === NodeType.PARAGRAPH) {
          this.document.addRaw(line.consumeAll());
        } else {
          this.document.closeUntilContainerBlock(blockQuoteLazyContinuation);
          this.document.openWithRaw(NodeType.PARAGRAPH, line.consumeAll());
        }
      } while (!line.eol());
    }

    this.document.closeAll();
    return this.document;
  }
}
