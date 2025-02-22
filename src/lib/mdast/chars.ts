// as per https://spec.commonmark.org/0.31.2/#unicode-whitespace-character
const UNICODE_WHITESPACE_CHARACTERS: Set<string> = new Set([
  '\u0020', // Space
  '\u00A0', // No-Break Space
  '\u1680', // Ogham Space Mark
  '\u2000', // En Quad
  '\u2001', // Em Quad
  '\u2002', // En Space
  '\u2003', // Em Space
  '\u2004', // Three-Per-Em Space
  '\u2005', // Four-Per-Em Space
  '\u2006', // Six-Per-Em Space
  '\u2007', // Figure Space
  '\u2008', // Punctuation Space
  '\u2009', // Thin Space
  '\u200A', // Hair Space
  '\u202F', // Narrow No-Break Space
  '\u205F', // Medium Mathematical Space
  '\u3000', // Ideographic Space
  '\u0009', // Tab
  '\u000A', // Line Feed
  '\u000C', // Form Feed
  '\u000D', // Carriage Return
]);
export const isUnicodeWhitespace = (char: string): boolean => UNICODE_WHITESPACE_CHARACTERS.has(char);

// as per https://spec.commonmark.org/0.31.2/#ascii-punctuation-character
const ASCII_PUNCTUATION_CHARACTER: Set<string> = new Set([
  '\u0021', '\u0022', '\u0023', '\u0024', '\u0025', '\u0026', '\u0027', '\u0028', '\u0029', '\u002A', '\u002B',
  '\u002C', '\u002D', '\u002E', '\u002F',

  '\u003A', '\u003B', '\u003C', '\u003D', '\u003E', '\u003F', '\u0040',

  '\u005B', '\u005C', '\u005D', '\u005E', '\u005F', '\u0060', '\u007B', '\u007C', '\u007D', '\u007E',
]);
export const isAsciiPunctuation = (char: string): boolean => ASCII_PUNCTUATION_CHARACTER.has(char);

// as per https://spec.commonmark.org/0.31.2/#unicode-punctuation-character
const UNICODE_PUNCTUATION: Set<string> = new Set([
  '\u0021', '\u0022', '\u0023', '\u0024', '\u0025', '\u0026', '\u0027', '\u0028', '\u0029', '\u002A', '\u002B',
  '\u002C', '\u002D', '\u002E', '\u002F', // Basic punctuation

  '\u003A', '\u003B', '\u003C', '\u003D', '\u003E', '\u003F', '\u0040', '\u005B', '\u005C', '\u005D', '\u005E',
  '\u005F', '\u0060', // More punctuation

  '\u00A1', '\u00A7', '\u00AB', '\u00B6', '\u00B7', '\u00BB', '\u00BF', // Latin punctuation

  '\u2010', '\u2011', '\u2012', '\u2013', '\u2014', '\u2015', '\u2016', '\u2017', '\u2018', '\u2019', '\u201A',
  '\u201B', '\u201C', '\u201D', '\u201E', '\u201F', // Quotation marks and dashes

  '\u2020', '\u2021', '\u2022', '\u2023', '\u2024', '\u2025', '\u2026', '\u2027', // Bullet points and ellipses

  '\u2030', '\u2031', '\u2032', '\u2033', '\u2034', '\u2035', '\u2036', '\u2037', '\u2038', '\u2039', '\u203A',
  '\u203B', '\u203C', '\u203D', '\u203E', // Various symbols

  '\u2041', '\u2042', '\u2043', '\u2044', '\u2045', '\u2046', '\u2047', '\u2048', '\u2049', '\u204A', '\u204B',
  '\u204C', '\u204D', '\u204E', '\u204F', '\u2050', // More punctuation

  '\u20A0', '\u20A1', '\u20A2', '\u20A3', '\u20A4', '\u20A5', '\u20A6', '\u20A7', '\u20A8', '\u20A9', '\u20AA',
  '\u20AB', '\u20AC', '\u20AD', '\u20AE', '\u20AF', '\u20B0', '\u20B1', '\u20B2', '\u20B3', '\u20B4', '\u20B5',
  '\u20B6', '\u20B7', '\u20B8', '\u20B9', '\u20BA', '\u20BB', '\u20BC', '\u20BD', '\u20BE', '\u20BF', // Currency symbols
]);
export const isUnicodePunctuation = (char: string): boolean => UNICODE_PUNCTUATION.has(char);

// as per https://spec.commonmark.org/0.31.2/#tab
export const isTab = (char: string): boolean => char === '\u0009';

// as per https://spec.commonmark.org/0.31.2/#space
export const isSpace = (char: string): boolean => char === '\u0020';

// as per https://spec.commonmark.org/0.31.2/#line-ending
export const isCR = (char: string): boolean => char === '\u000D';
export const isLF = (char: string): boolean => char === '\u000A';
