---
title: 'Managing languages'
---

In the 'Available language' section of the Admin interface you can control which languages are available in your Ketty instance and customise how they appear to users. You can use standardised language versions provided by default, or create customised versions tailored to your specific needs.

## Viewing available languages

This section shows all languages currently supported. For each language, you'll see:

- The language name
- An (enabled) or (disabled) status indicator
- Toggle switches for managing settings

## Managing language settings

### Enabling/disabling languages

- Use the "Enabled" toggle switch to control language visibility
- When disabled, a language won't appear in the language switcher
- Disabled languages remain configured but are hidden from users

### Standardised vs customised versions

#### Using standardised versions

1. Enable the "Use standardised version" toggle
2. This will use the default translations provided by Ketty

:::info
To contribute improvements to the standardised version or **submit a new language**, refer to the ['Localisation' section](../../getInvolved/04-Localising%20Ketty's%20Interface.md) of the Contributor's Guide.
:::

#### Using customised versions

1. Turn off the "Use standardised version" toggle to enable customisation
2. Configure the following:
   - Label: Enter how the language should appear in the dropdown menu, for example "Spanish (Argentina)
   - Flag code: Enter the country code to display the flag icon (see [reference list](https://www.iso.org/obp/ui/#search))
3. Upload your custom translation file using the "+" button.

:::warning
If you use a customised language, you will need to update this file manually when new UI text is introduced in Ketty software updates. The [Ketty release notes](https://gitlab.coko.foundation/coko-org/products/ketty/ketty/-/releases) will list any new or updated text strings.
:::

## Adding a new language

1. Click the "Add New Language" button
2. Fill in the required fields:
   - Label: Enter how the language should appear in the dropdown menu, for example "Spanish (Argentina)
   - Flag code: Enter the country code to display the flag icon (see [reference list](https://www.iso.org/obp/ui/#search))
3. Click "Save New Language" to complete the process

:::info
When you add a new language, it functions as a customised language. If other Ketty users would benefit from this language, please consider **contributing a new standardised language** by referring to the ['Localisation' section](../../getInvolved/04-Localising%20Ketty's%20Interface.md) of the Contributor's Guide.
:::

## Managing translation files

### Downloading translations

- Click "Download translation strings for this language" to get the current translation file
- Use this file as a template for creating custom translations
- The file contains all translatable text in JSON format

### Uploading customised translations

- Click the "+" button next to "Upload a new translations file"
- Select your prepared translation file
- Only valid JSON files in the correct format will be accepted

## Updating language settings

After making any changes:

1. Review your settings
2. Click the "Update" button to save changes
3. Changes will take effect immediately for all users

## Best practices

- Test the language switcher after enabling/disabling languages
- Keep language labels clear and consistent
- Back up custom translation files before making changes
- Review translations in the interface after uploading.
