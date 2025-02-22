import { BlockParser } from './block_parser';
import { defaultConfig } from './index';
import { InlineParser } from './inline_parser';
import { HTMLRenderer } from './render';
import tests from './tests.json';
import testsExtra from './tests_extra.json';

// Tests numbers as per https://spec.commonmark.org/0.31.2/
const testNumbers = [
  17, 18, 19,

  62, 63, 64, 67, 68, 69, 70, 71, 72, 73, 74, 75, 78, 79,

  107, 110, 111, 112, 113, 114, 116, 117, 1001, 118,

  119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138,
  139, 140, 145, 147,

  219, 220, 221, 222, 223, 224, 225,

  227,

  228, 229, 230, 231, 232, 233, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 247, 248, 249, 252,

  327, 328, 329, 330, 331, 332, 333, 334, 335, 336, 337, 338, 339, 340, 341, 342, 343, 345, 347, 348, 349,

  483, 484, 485, 486, 487, 488, 489, 490, 492, 494, 496, 497, 499, 501, 511, 518, 521, 522, 525, 1002, 1003, 1004, 1005,

  594, 595, 596, 597, 598, 599, 600, 601, 602, 603, 607, 608, 609, 610, 611, 612,

  650, 651, 652,
];
const skippedTests: number[] = [
  489, 494, 595, 603,
];

const runOnly = 0; // 0 means run all

const testsToRun = [...tests, ...testsExtra].filter((t) => (runOnly ? [runOnly] : testNumbers).includes(t.example));
let ok = 0;
let failed = 0;
let skipped = 0;
for (const test of testsToRun) {
  if (!runOnly && skippedTests.includes(test.example)) {
    skipped++;
    continue;
  }
  const p = new BlockParser(test.markdown, defaultConfig);
  const doc = p.parse();

  // doc.inspect();
  const ip = new InlineParser(doc, defaultConfig);

  ip.parse();

  const r = new HTMLRenderer();
  const html = r.renderNode(doc.root);

  if (html !== test.html) {
    failed++;
    console.log(`======= Test #${test.example} failed: =========\nMarkdown:\n${test.markdown}\n\nExpected HTML:\n${test.html}\n\nActual HTML:\n${html}\n\n`);
    doc.inspect();
    console.log('\n\n');
  } else {
    ok++;
  }
}

console.log(`===================\n${ok} OK; ${failed} Failed; ${skipped} Skipped; ${testsToRun.length} total\n===================\n`);
