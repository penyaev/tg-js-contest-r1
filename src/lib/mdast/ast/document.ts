import type {
  AtxHeadingNode, CodeSpanNode, EmphNode, FencedCodeBlockNode, LinkNode, TextNode,
} from './node';

import { Node, NodeType, RawNode } from './node';

export class Document {
  public root: Node;

  public current: Node;

  constructor() {
    this.root = new Node(NodeType.DOCUMENT);
    this.current = this.root;
  }

  public currentType(): NodeType {
    return this.current.type;
  }

  public open(type: NodeType) {
    const node = new Node(type);
    this.openNode(node);
  }

  public close() {
    if (this.current.parent === undefined) {
      throw new Error('cannot close root node');
    }

    this.current.close();
    this.current = this.current.parent;
  }

  public closeAll() {
    while (![NodeType.DOCUMENT].includes(this.current.type)) {
      this.close();
    }
  }

  public closeUntilContainerBlock(disallowBlockquote: boolean = false) {
    const allowedNodeTypes = [NodeType.DOCUMENT];
    if (!disallowBlockquote) {
      allowedNodeTypes.push(NodeType.BLOCK_QUOTE);
    }
    while (!allowedNodeTypes.includes(this.current.type)) {
      this.close();
    }
  }

  public closeUntilIncluding(type: NodeType) {
    while (![type].includes(this.current.type)) {
      this.close();
    }
    this.close();
  }

  public openNode(node: Node) {
    this.addNode(node);
    this.current = node;
  }

  public addNode(node: Node) {
    this.current.addChild(node);
  }

  public addNodes(nodes: Node[]) {
    nodes.forEach((node) => this.addNode(node));
  }

  public add(type: NodeType) {
    this.open(type);
    this.close();
  }

  public addRaw(raw: string) {
    this.openNode(new RawNode(raw));
    this.close();
  }

  public openWithRaw(type: NodeType, raw: string) {
    this.open(type);
    this.addRaw(raw);
  }

  public findParent(type: NodeType): Node | undefined {
    let node: Node | undefined = this.current;
    while (node !== undefined) {
      if (node.type === type) {
        return node;
      }
      node = node.parent;
    }
    return undefined;
  }

  private inspectNode(node: Node, indentation: number = 0) {
    const indent = ' '.repeat(indentation * 2);
    let content = '';
    switch (node.type) {
      case NodeType.TEXT: {
        const n = node as TextNode;
        content = `"${n.text.replaceAll('\n', '\\n')}"`;
        break;
      }
      case NodeType.RAW: {
        const n = node as RawNode;
        content = `"${n.raw.replaceAll('\n', '\\n')}"`;
        break;
      }
      case NodeType.ATX_HEADING: {
        const n = node as AtxHeadingNode;
        content = `level: ${n.level}`;
        break;
      }
      case NodeType.EMPH: {
        const n = node as EmphNode;
        content = `type: ${n.emphType}`;
        break;
      }
      case NodeType.CODE_SPAN: {
        const n = node as CodeSpanNode;
        content = `backticks: ${n.backticks}`;
        break;
      }
      case NodeType.LINK: {
        const n = node as LinkNode;
        content = `dst: ${n.destination}, typ: ${n.linkType}`;
        break;
      }
      case NodeType.FENCED_CODE_BLOCK: {
        const n = (node as FencedCodeBlockNode);
        content = `type: ${n.fenceType}, len: ${n.fenceLen}, indent: ${n.fenceIndentation}, info: ${n.infoString}`;
        break;
      }
    }
    content = content ? ` (${content})` : '';

    for (const child of node.children) {
      this.inspectNode(child, indentation + 1);
    }
  }

  public inspect() {
    this.inspectNode(this.root);
  }

  public traverse() {

  }
}
