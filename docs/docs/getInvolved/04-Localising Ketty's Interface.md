---
title: "Localising Ketty's Interface"
---

## Introduction

This guide will help you understand how to work with our user interface lanaguage file for translations and editorial consistency. While these files might look complex at first, you'll only need to focus on specific parts, and we'll show you exactly what to look for. We'll also share tips for maintaining consistent style and tone throughout the interface.

All UI text is stored in the lanagage files in [ketty/server/cofig/languages](https://gitlab.coko.foundation/coko-org/products/ketty/server/-/tree/main/config/languages?ref_type=heads). The `en.json` file is for **Standardised Enlish (UK)** interface and is the source for all translations.

## Understanding the language file

### Basic structure

Our language file is organised like a large catalog, with sections for different pages of the application. Think of it as a book with chapters (pages) and each chapter having multiple sections. All the text that appears in our application is stored in this file.

:::info
The most important thing to understand is that you only need to translate the text that appears after `"value":`. Here's a simple example:

```json
{
  "title": {
    "type": "title",
    "value": "Knowledge Base" // Only translate this text. Do not remove the quotation marks.
  }
}
```

:::

### Finding your way around

The file is organised into "pages" that correspond to different screens in the application. These pages are arranged alphabetically:

- admin
- aiBookDesigner
- common
- dash
- knowledgeBase
- login
- newBook
- passwordReset
- previewAndPublish
- producer
- signup

There's also a special "common" section that contains text used across multiple pages (like buttons labeled "Save" or "Cancel"). This helps us maintain consistency - when you translate these common elements once, they'll be used everywhere they appear.

## Understanding text types

Each piece of text in our interface has a specific type that tells us how it's used. Understanding these types can help you maintain consistent style and tone. Here are the main types you'll encounter:

### Page elements

1. **Titles** (`"type": "title"`)

   - These are the main titles
   - Example: "Knowledge Base", "Preview and Publish"
   - Recommended style guide: Use Title Case
   - TIP: Search for `"type": "title"` to review all titles and ensure consistency

2. **Headings** (`"type": "heading"`)

   - These are section headers within pages
   - TIP: Search for `"type": "heading"` to review all headings

3. **Details** (`"type": "detail"`)
   - These provide explanatory text
   - Example: "This information will be used for optional front matter pages."
   - Recommended style guide: Use sentence case and end with a period
   - TIP: Search for `"type": "detail"` to ensure all explanatory text follows the same style

### Interactive Elements

4. **Button Text** (`"type": "button"`)

   - Text that appears on clickable buttons
   - Example: "Save", "Upload", "Continue"
   - Recommended style guide: Use Title Case, keep concise
   - TIP: Check the "common" section first for standard button text

5. **Labels** (`"type": "input(label)"` and `"select(label)"`)

   - Text that appears above input fields, checkboxes and dropdowns
   - Example: "Email address", "Password"
   - Recommended style guide: Use sentence case

6. **Placeholders** (`"type": "input(placeholder)"`)
   - Helper text inside input fields
   - Example: "Enter your email address"
   - Recommended style guide: Use sentence case, start with a verb
   - TIP: Keep placeholders brief and helpful

### Messages

7. **Error Messages** (`"type": "error"`)

   - Text shown when something goes wrong
   - Example: "Email is required"
   - Recommended style guide: Use sentence case, be clear but gentle
   - TIP: Check the "common" section for standard error messages

8. **Status Messages** (`"type": "message"`)
   - Updates about system state
   - Example: "Last updated %\{timestamp}"
   - Note: Don't translate placeholders like %\{timestamp}

## Tips for maintaining consistency and avoiding issues

1. **Use search effectively**

   - Use your text editor's search function to find all instances of a specific type
   - Example: Search for `"type": "title"` to review all titles at once
   - This helps ensure consistent capitalisation and terminology

2. **Check common elements first**

   - Always check the "common" section first when translating standard elements
   - This includes buttons, error messages, and form labels

3. **Watch out for variables**

   - Some text includes variables in the format `%{variableName}`
   - Don't translate these variables
   - Example: "Last updated %\{timestamp}" -> "Dernière mise à jour %\{timestamp}"

4. **Handle special characters**

   - You can use any unicode characters in your translations
   - Don't add HTML or other markup
   - Preserve any punctuation that appears in the English text

5. **Length considerations**
   - Remember that some languages may need more or fewer characters
   - Keep translations concise where possible
   - Consider how the text will look in the interface

## Contributing a new language

To contibute a new langauge:

1. First, get in touch with the Ketty team to make sure the language translation you'd like to add isn't already in progress.
2. Download the **Standardised Enlish (UK)** file from the Admin interface of your Ketty instance or from the source code [here](https://gitlab.coko.foundation/coko-org/products/ketty/server/-/blob/main/config/languages/en.json?ref_type=heads).
3. Name the file with the language code from [this list](https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry).
4. If it's necessary to distinguish the region, then append the region code from [this list](https://www.iso.org/obp/ui/#search).
5. Translate the file following the guidelines above.
6. Submit an MR or send the file to ketty@coko.foundation
