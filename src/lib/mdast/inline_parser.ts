import type { Document } from './ast/document';
import type { Node, RawNode } from './ast/node';
import type { Config } from './config';
import type { Token } from './inline_lexer';

import {
  CodeSpanNode, EmphNode, EmphType, LinkNode, LinkType,
  NodeType, TextNode,
} from './ast/node';
import { InlineLexer, TokenType } from './inline_lexer';

const SOFTBREAK = '\n'; // https://spec.commonmark.org/0.31.2/#softbreak
const PRECEDENCE = new Map<TokenType, number>([
  [TokenType.BACKTICK_STRING, 15],

  [TokenType.LINK_BOUNDARY, 13],
  [TokenType.LINK_MIDDLE, 13],
  [TokenType.POINTY_BRACKET, 13],

  [TokenType.BOLD_DELIM_RUN, 10],
  [TokenType.ITALIC_DELIM_RUN, 10],
  [TokenType.STRIKETHROUGH_DELIM_RUN, 10],
  [TokenType.SPOILER_DELIM_RUN, 10],

  [TokenType.TEXT, 5],

  [TokenType.UNKNOWN, 0],
]);

type InlineParserStackItem = {
  token: Token | undefined;
  node: Node | undefined;
};

export class InlineParser {
  constructor(private document: Document, private config: Config) {
  }

  private beginsWithPointyBracket(s: string) {
    const lt = this.config.escapedGtLt ? '&lt;' : '<';

    return s.indexOf(lt) === 0;
  }

  private endsWithPointyBracket(s: string) {
    const gt = this.config.escapedGtLt ? '&gt;' : '>';

    return s.indexOf(gt) === s.length - gt.length;
  }

  private removePointyBrackets(s: string) {
    const lt = this.config.escapedGtLt ? '&lt;' : '<';
    const gt = this.config.escapedGtLt ? '&gt;' : '>';

    return s.slice(lt.length, s.length - gt.length);
  }

  private tryAddContentPointyBrackets(node: LinkNode, content: InlineParserStackItem[]): boolean {
    for (let i = 0; i < content.length; i++) {
      const item = content[i];

      let t: string = '';
      if (item.node) {
        if (item.node.type !== NodeType.TEXT) { // link destination can only contain text
          return false;
        }
        t = (item.node as TextNode).text;
      } else if (item.token) {
        t = item.token.s;
      }

      node.destination += t;
    }

    if (!/^[a-z][a-z0-9+.-]{1,31}:[^ <>]*$/i.test(node.destination)) {
      return false;
    }

    node.addChild(new TextNode(node.destination)); // destination becomes text


    return true;
  }

  private tryAddContentLink(node: LinkNode, content: InlineParserStackItem[]): boolean {
    let destBracketsUnbalanced: boolean = false;
    let destBracketsBalance: number = 0;

    let linkText = true;
    let containsAutolink = false;
    for (let i = 0; i < content.length; i++) {
      const item = content[i];
      if (item.token && item.token.type === TokenType.LINK_MIDDLE) {
        linkText = false;
        continue;
      }

      if (linkText) {
        if (item.node) {
          // link titles cannot contain other links
          if (item.node.type === NodeType.LINK) {
            return false;
          }
          node.addChild(item.node);
        } else if (item.token) {
          node.addChild(new TextNode(item.token.s)); // any token becomes text
        }
      } else {
        let t: string = '';
        if (item.node) {
          if (item.node.type === NodeType.TEXT) {
            t = (item.node as TextNode).text;
          } else if (
            // Link destination can contain an autolink: [title](<https://google.com>)
            !containsAutolink
            && item.node.type === NodeType.LINK
            && (item.node as LinkNode).linkType === LinkType.AUTOLINK
          ) {
            t = (item.node as LinkNode).destination;
            containsAutolink = true;
          } else {
            return false;
          }
        } else if (item.token) {
          t = item.token.s;
        }

        for (let j = 0; j < t.length; j++) {
          if (t[j] === '(') {
            destBracketsBalance++;
          }
          if (t[j] === ')') {
            destBracketsBalance--;
            if (destBracketsBalance < 0) {
              destBracketsUnbalanced = true;
              break;
            }
          }
        }
        if (t.includes('\n')) {
          return false; // The destination cannot contain line endings (test 490)
        }
        node.destination += t;
      }
    }

    if (linkText) { // if we never switched to the dest part
      return false;
    }
    let pointyBrackets = containsAutolink;

    if (!pointyBrackets && this.beginsWithPointyBracket(node.destination)) {
      if (this.endsWithPointyBracket(node.destination)) {
        node.destination = this.removePointyBrackets(node.destination);
        pointyBrackets = true;
      } else {
        return false;
      }
    }

    // spaces can only be part of destination if enclosed within pointy brackets (tests 488, 489)
    if (node.destination.includes(' ') && !pointyBrackets) {
      return false;
    }

    // unbalanced brackets disallowed unless we're inside pointy brackets (test 496)
    if ((destBracketsUnbalanced || destBracketsBalance !== 0) && !pointyBrackets) {
      return false;
    }

    return true;
  }

  private createNode(token: Token, content: InlineParserStackItem[]): Node | undefined {
    let node: Node;
    switch (token.type) {
      case TokenType.BOLD_DELIM_RUN:
      case TokenType.ITALIC_DELIM_RUN:
      case TokenType.SPOILER_DELIM_RUN:
      case TokenType.STRIKETHROUGH_DELIM_RUN: {
        const emphType = {
          [TokenType.BOLD_DELIM_RUN]: EmphType.BOLD,
          [TokenType.ITALIC_DELIM_RUN]: EmphType.ITALIC,
          [TokenType.SPOILER_DELIM_RUN]: EmphType.SPOILER,
          [TokenType.STRIKETHROUGH_DELIM_RUN]: EmphType.STRIKETHROUGH,
        };
        node = new EmphNode(emphType[token.type], this.config);
        break;
      }

      case TokenType.BACKTICK_STRING: {
        node = new CodeSpanNode(token.s.length);
        break;
      }

      case TokenType.TEXT: {
        node = new TextNode(token.s);
        break;
      }

      case TokenType.POINTY_BRACKET: {
        node = new LinkNode(LinkType.AUTOLINK, '');
        break;
      }

      case TokenType.LINK_BOUNDARY: {
        node = new LinkNode(LinkType.NORMAL, '');
        break;
      }

      default: {
        throw new Error('unknown token type');
      }
    }

    /**
     * For links, we have special logic to add content to them
     * For everything else, we just add the content as text
     */
    if (token.type === TokenType.POINTY_BRACKET) {
      if (!this.tryAddContentPointyBrackets(node as LinkNode, content)) {
        return undefined;
      }
    } else if (token.type === TokenType.LINK_BOUNDARY) {
      if (!this.tryAddContentLink(node as LinkNode, content)) {
        return undefined;
      }
    } else {
      content.forEach((contentItem) => {
        if (contentItem.node) {
          node.addChild(contentItem.node);
        } else if (contentItem.token) {
          node.addChild(new TextNode(contentItem.token.s)); // any token becomes text
        }
      });
    }

    node.close();
    return node;
  }

  private match(left: Token, right: Token): boolean {
    if (left.type !== right.type) {
      return false;
    }

    if (!left.left || !right.right) {
      return false;
    }

    switch (left.type) {
      case TokenType.BACKTICK_STRING: {
        if (left.s !== right.s) { // for backticks, left and right lengths must match (test 339)
          return false;
        }
        break;
      }
    }

    return true;
  }

  private parseRaw(s: string): Node[] {
    const lexer = new InlineLexer(s, this.config);

    // console.log(`[${s.replaceAll('\n', '\\n')}]\n`);
    const stack: InlineParserStackItem[] = [];
    while (true) {
      const token = lexer.next();
      if (!token) {
        break;
      }

      let tokenUsed = false;

      // check if this token will match something and we'll make a node out of it
      if (token.right) {
        const tokenPrecedence = PRECEDENCE.get(token.type) || 0;
        for (let i = stack.length - 1; i >= 0; i--) {
          if (
            stack[i].token
            && ((PRECEDENCE.get(stack[i].token!.type) || 0) > tokenPrecedence)
          ) {
            break;
          }

          if (
            stack[i].token
            && this.match(stack[i].token!, token)
          ) {
            // create a node from the range of stack elements
            const content = stack.slice(i + 1);
            const node = this.createNode(token, content);
            if (node !== undefined) {
              stack.splice(i, stack.length - i, {
                token: undefined,
                node,
              });
              tokenUsed = true;

              break;
            }
          }
        }
      }

      // if we couldn't find a matching pair, store this token for later
      if (!tokenUsed) {
        stack.push({
          token,
          node: undefined,
        });
        tokenUsed = true;
      }
    }

    // finally, close all tokens that remain open
    // and convert everything else into text
    const result: Node[] = [];

    for (let i = 0; i < stack.length; i++) {
      const item = stack[i];
      // we'll need to convert every item to a node if not's not one already

      if (item.token && item.token.left) {
        // try to find a matching right token
        for (let j = i + 1; j < stack.length; j++) {
          if (
            stack[j].token
            && this.match(item.token, stack[j].token!)
          ) {
            const node = this.createNode(item.token, stack.slice(i + 1, j));
            if (node !== undefined) {
              stack.splice(i, j - i + 1, {
                token: undefined,
                node,
              });
              break;
            }
          }
        }
      }

      if (stack[i].token) { // if it's still not a node, convert it to text
        stack.splice(i, 1, {
          token: undefined,
          node: new TextNode(stack[i].token!.s),
        });
      }

      // now it has to be a node, it can't be anything else
      result.push(stack[i].node!);
    }

    return result;
  }

  private walk(node: Node) {
    let buffer = [];
    let from = 0;
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      const nextChild = node.children[i + 1];

      if (child.type === NodeType.RAW) {
        if (!buffer.length) {
          from = i;
        }
        buffer.push((child as RawNode).raw);
      } else {
        this.walk(child);
      }

      if (buffer.length && ((nextChild && nextChild.type !== NodeType.RAW) || !nextChild)) {
        const parsed = this.parseRaw(buffer.join(SOFTBREAK));
        node.children.splice(from, i - from + 1, ...parsed);
        i -= i - from + 1;
        i += parsed.length;
        buffer = [];
      }
    }
  }

  public parse() {
    this.walk(this.document.root);
  }
}
