# [JavaScript Contest, Round 1](https://t.me/contest/397)

author: Ilya Penyaev (t.me/penyaev)

PR: https://github.com/penyaev/tg-js-contest-r1/pull/1/files

All code was written by myself, no external frameworks/libraries used. It does not affect Web A's performance or stability. When possible, I tried to stick to existing app architecture and coding standards in Web A's current codebase and not introduce any radically new approaches or practices. Occasionally I stumbled upon various bugs/issues in the app that I tried to fix along the way even though they were not related to the challenge.

Below is a brief overview of changes made to the app:

## 1. Markdown syntax support & AST-based parser

AST-based markdown parser was implemented (see `src/lib/mdast`). It follows the [Commonmark standard](https://spec.commonmark.org/0.31.2/) as much as possible given existing limitations of [Telegram protocol](https://core.telegram.org/type/MessageEntity) (e.g. nested blockquotes or headers are not supported, and others.) This implementation passes about 150 most fundamental tests from the testset provided by the standard (see `src/lib/mdast/test.ts`).

Occasionally there were some discrepancies between the standard and Telegram implementations of Markdown. In such cases I tried to stick to implementations from existing Telegram clients but there are probably still some unhandled edge cases. Markdown parser is extensible and can easily adapt to evolving Telegram protocol. Bot API defines [its own markdown syntax](https://core.telegram.org/bots/api#markdownv2-style) which is different from what is currently used in normal chats, therefore it was not taken into consideration.

Some of the supported features (try copy-pasting this into the message input and sending):
<pre>
> blockquote, line 1
> line 2, with some **__extra__** `formatting` and a [link](https://telegram.org)
blockquote continues even without the leading `>` (so-called 'lazy continuation')

> > nested blockquotes are not supported by the protocol,
> > therefore extra `>`s are ignored

new paragraph starts after a blank line

> Code block with specified `language`, nested inside a blockquote:
> ```js
> // code block:
> hello_world();
> ```

[link __titles__ ~~can~~ also **be** ||formatted||](https://telegram.org)

**nested ~~formatting __is not__ a~~ ||problem||**

```This is an `autolink`: <https://telegram.org>```

</pre>

## 2. Quote editing

Quotes can now be created and edited (both via `>` markdown syntax and the floating formatting toolbar.) This comes with a bunch of bugs/issues with `TextFormatter` fixed along the way, such as: nested formatting, indication of currently applied formatting, removing formatting, creating and editing links and handling some edge cases (e.g. making text bold, then making a part in the middle normal would split the text node into three distinct ones which would need special handling in the code.)

## 3. Text editor edit history fixed

Message input didn't handle undo actions properly when emojis were added via the emoji selector, and/or when copy-pasting data from the clipboard. This is now fixed. Undo works properly not only when cmd/ctrl+z is used but also when user selects "undo" in the OS context menu. Redo also works as expected (try cmd/ctrl+shift+z)

## 4. Chat Folders sidebar

Chat Folders can now be displayed on the left side of the screen, when screen size allows (on small screens that are less than 925px wide, folders are always displayed at the top.) Chat folders layout is configurable in the settings menu. Chat folders on the left have all the same functionality as previous version has (e.g. right-click context actions.) Similar to other implementations, icons for chats are selected automatically based on their configuration. It is possible to specify a custom icon from a predefined set. Contrary to the provided mockups, Telegram protocol does not allow specifying arbitrary emoji as an icon for a folder. A few dozens of icons are supported similarly to other clients. Night mode is supported.

There a few discrepancies in implementations of chat folder icons between clients. E.g.: "airplane" icon is supported by tdesktop, but not supported by the Mac App Store client. I mostly followed tdesktop implementation as it looked a bit more feature-rich to me.

## 5. Animated backgrounds

Animated backgrounds can now be selected in the settings menu. Similarly to other clients, background is animated slightly every time user sends a message.
