---
title: 'Ketty Interface Editorial Style Guide'
---

Follow this style guide if you're contributing to the **stardardised English (UK) Ketty interface**.

All UI text is stored in the lanagage file `en-GB.json` in [ketty/server/cofig/languages](https://gitlab.coko.foundation/coko-org/products/ketty/server/-/tree/main/config/languages?ref_type=heads). Refer to the [Localisation section](../getInvolved/04-Localising%20Ketty's%20Interface.md) which describles how the language file is structured.

## Updating the stardardised English (UK) Ketty interface

1. Download the **Standardised English (UK)** file from the Admin interface of your Ketty instance or from the source code [here](https://gitlab.coko.foundation/coko-org/products/ketty/server/-/blob/main/config/languages/en-GB.json?ref_type=heads).
2. Make the text updates following the style guidelines below.
3. Submit an MR or send the file by email to the Ketty team.

## Style Guidelines

### Capitalisation

- The titles of pages and tab titles use **Title Case**.
- Button text and modal titles use **Title Case**. Modal titles must match the button text.
- Level 2 and 3 headings of pages, tabs, and modals use **Sentence case**. Headings 4 to 6 should be avoided.
- All other elements (such as labels for form inputs, checkboxes, and switches; and options in drowpdowns and menus) use **Sentence case**.

List of pages using title case:

1. Admin
2. Dashboard (aka Your Books)
3. Producer
4. Preview and Publish
5. Book Metadata
6. Book Settings
7. Share
8. Knowledge Base
9. AI Book Designer
10. New Preview
11. Publishing Profiles

Any reference to these pages within the UI should also use **Title Case**.

:::tip
Search for the following "types" in the `en-GB.json` file to check the capitalisation consistency:

- "title"
- "heading"
- "button"
- "input(label)"
- "switch(label)"
- "select(label)"
- "options" _within `menu` and `select`_
  :::

### Spelling

- British English
- `ise` word endings (not `ize`), for example, 'Customise', not 'Customize'.

### Word list

Follow this list for the punctuation and use of proper names and terms used in the Ketty UI.

:::note
Please maintain alphabetical order when updating this list.
:::

- API
- EPUB
- ISBN
- Lulu, when referring to the print-on-demand service
- PDF
- print-on-demand (abbreviated as POD)
