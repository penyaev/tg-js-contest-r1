import type {
  AtxHeadingNode, CodeSpanNode, EmphNode, FencedCodeBlockNode, LinkNode, Node, RawNode, TextNode,
} from './ast/node';

import { NodeType } from './ast/node';

export interface Renderer {
  renderNode(node: Node): string;
}

const HTML_ENTITY_MAP: Map<number, string> = new Map([
  [34, 'quot'], // " (double quotation mark)
  [38, 'amp'], // & (ampersand)
  // [39, 'apos'], // ' (apostrophe)
  [60, 'lt'], // < (less-than sign)
  [62, 'gt'], // > (greater-than sign)
  // [160, 'nbsp'], // Non-breaking space
  [161, 'iexcl'], // ¡ (inverted exclamation mark)
  [162, 'cent'], // ¢ (cent sign)
  [163, 'pound'], // £ (pound sign)
  [164, 'curren'], // ¤ (currency sign)
  [165, 'yen'], // ¥ (yen sign)
  [166, 'brvbar'], // ¦ (broken bar)
  [167, 'sect'], // § (section sign)
  [168, 'uml'], // ¨ (diaeresis)
  [169, 'copy'], // © (copyright sign)
  [170, 'ordf'], // ª (feminine ordinal indicator)
  [171, 'laquo'], // « (left-pointing double angle quotation mark)
  [172, 'not'], // ¬ (negation)
  [173, 'shy'], // ­ (soft hyphen)
  [174, 'reg'], // ® (registered sign)
  [175, 'macr'], // ¯ (macron)
]);

// Function to get the HTML entity name from its decimal value
const getHtmlEntityName = (code: number): string | undefined => HTML_ENTITY_MAP.get(code);

const htmlEncode = (s: string) => s.replace(/[\u0022-\u9999<>&]/g, (i) => {
  const code = i.charCodeAt(0);
  const name = getHtmlEntityName(code);
  // return name ? `&${name};` : `&#${code};`;
  return name ? `&${name};` : i;
});

export class HTMLRenderer implements Renderer {
  renderNode(node: Node): string {
    switch (node.type) {
      case NodeType.TEXT: {
        const tn = node as TextNode;
        return htmlEncode(tn.text);
      }
      case NodeType.RAW: {
        const tn = node as RawNode;
        return htmlEncode(tn.raw);
      }
      case NodeType.PARAGRAPH: {
        const tn = node;
        return `<p>${tn.children.map((n) => this.renderNode(n)).join('')}</p>\n`;
      }
      case NodeType.BLOCK_QUOTE: {
        const tn = node;
        return `<blockquote>\n${tn.children.map((n) => this.renderNode(n)).join('')}</blockquote>\n`;
      }
      case NodeType.ATX_HEADING: {
        const tn = node as AtxHeadingNode;
        return `<h${tn.level}>${tn.children.map((n) => this.renderNode(n)).join('')}</h${tn.level}>\n`;
      }
      case NodeType.FENCED_CODE_BLOCK: {
        const tn = node as FencedCodeBlockNode;
        return `<pre><code>${tn.children.map((n) => this.renderNode(n)).join('')}</code></pre>\n`;
      }
      case NodeType.INDENTED_CODE_BLOCK: {
        const tn = node;
        return `<pre><code>${tn.children.map((n) => this.renderNode(n)).join('')}</code></pre>\n`;
      }
      case NodeType.DOCUMENT: {
        const tn = node;
        return tn.children.map((n) => this.renderNode(n)).join('');
      }
      case NodeType.EMPH: {
        const tn = node as EmphNode;
        const tag = tn.tag();
        return `<${tag}>${tn.children.map((n) => this.renderNode(n)).join('')}</${tag}>`;
      }
      case NodeType.CODE_SPAN: {
        const tn = node as CodeSpanNode;
        return `<code>${tn.children.map((n) => this.renderNode(n)).join('')}</code>`;
      }
      case NodeType.LINK: {
        const tn = node as LinkNode;
        return `<a href="${tn.destination}">${tn.children.map((n) => this.renderNode(n)).join('')}</a>`;
      }
      default: {
        throw new Error(`dont know how to render ${node.type}`);
      }
    }
  }
}

export class TelegramRenderer implements Renderer {
  renderNode(node: Node): string {
    switch (node.type) {
      case NodeType.TEXT: {
        const tn = node as TextNode;
        return (tn.text);
      }
      case NodeType.RAW: {
        const tn = node as RawNode;
        return htmlEncode(tn.raw);
      }
      case NodeType.PARAGRAPH: {
        const tn = node;
        return `${tn.children.map((n) => this.renderNode(n)).join('')}\n\n`;
      }
      case NodeType.BLOCK_QUOTE: {
        const tn = node;
        return `<blockquote>${tn.children.map((n) => this.renderNode(n)).join('')}</blockquote>\n`;
      }
      case NodeType.ATX_HEADING: {
        const tn = node as AtxHeadingNode;
        return `<h${tn.level}>${tn.children.map((n) => this.renderNode(n)).join('')}</h${tn.level}>\n`;
      }
      case NodeType.FENCED_CODE_BLOCK: {
        const tn = node as FencedCodeBlockNode;
        const lang = tn.infoString ? ` data-language="${tn.infoString}"` : '';
        return `<pre${lang}><code>${tn.children.map((n) => this.renderNode(n)).join('')}</code></pre>\n`;
      }
      case NodeType.INDENTED_CODE_BLOCK: {
        const tn = node;
        return `<pre><code>${tn.children.map((n) => this.renderNode(n)).join('')}</code></pre>\n`;
      }
      case NodeType.DOCUMENT: {
        const tn = node;
        return tn.children.map((n) => this.renderNode(n)).join('');
      }
      case NodeType.EMPH: {
        const tn = node as EmphNode;
        const tag = tn.tag();
        return `<${tag}${tn.attr()}>${tn.children.map((n) => this.renderNode(n)).join('')}</${tag}>`;
      }
      case NodeType.CODE_SPAN: {
        const tn = node as CodeSpanNode;
        return `<code>${tn.children.map((n) => this.renderNode(n)).join('')}</code>`;
      }
      case NodeType.LINK: {
        const tn = node as LinkNode;
        return `<a href="${tn.destination}">${tn.children.map((n) => this.renderNode(n)).join('')}</a>`;
      }
      default: {
        throw new Error(`dont know how to render ${node.type}`);
      }
    }
  }
}
