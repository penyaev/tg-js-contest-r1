import type { Renderer } from './render';

export type Config = {
  renderer: Renderer;
  disableLinks: boolean;
  escapedGtLt: boolean; // interpret '&gt;' and '&lt;' as '>' and '<'
  spoilerSpanAttr: string;
  convertBrToNewlines: boolean;
  enableHeaders: boolean;
};
