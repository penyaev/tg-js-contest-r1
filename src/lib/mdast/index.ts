import type { Config } from './config';

import { BlockParser } from './block_parser';
import { InlineParser } from './inline_parser';
import { HTMLRenderer } from './render';

export const defaultConfig: Config = {
  renderer: new HTMLRenderer(),
  disableLinks: false,
  escapedGtLt: false,
  spoilerSpanAttr: '',
  convertBrToNewlines: false,
  enableHeaders: true,
};

export function ParseAST(input: string, config: Partial<Config> = {}) {
  const c = { ...defaultConfig, ...config || {} };
  let i = input;

  if (c.convertBrToNewlines) {
    i = i.replace(/<br([^>]*)?>/g, '\n');
  }
  const bp = new BlockParser(i, c);
  const doc = bp.parse();

  const ip = new InlineParser(doc, c);
  ip.parse();

  return c.renderer.renderNode(doc.root);
}
