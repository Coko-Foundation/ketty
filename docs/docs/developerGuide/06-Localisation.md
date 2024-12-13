---
title: 'Language Localisation'
---

## Localisation with i18n

Ketty uses [i18n](https://www.i18next.com/) and its react adaptation [react-i18n](https://react.i18next.com/) to localise all the strings of the application. You can find the configuration in [ketty/app/translations/i18n.js](https://gitlab.coko.foundation/coko-org/products/ketty/ketty/-/blob/develop/app/translations/i18n.js).

To use the library throughout the app, first import the `useTranslation` hook in your file:

```js
// useTranslation will satisfy most of your use cases, Trans component may be needed for more complex interpolations
import { useTranslation, Trans } from 'react-i18next'


// initialize inside the functional component
const { t } = useTranslation()


// use it to translate strings
<p>{t('translation.key')}</p>

```

The key that you pass to the `t` function must match the key in the language file. Because of the [structure of our language file](#language-file-structure), it can be handy to initialize the translation function with a `keyPrefix`, to avoid repetion inside a component.

```js
// target all strings inside pages.admin in the translation file
const { t } = useTranslation(null, { keyPrefix: 'pages.admin' })


// this will be equivalent to t('pages.admin.title')
<h1>{t('title')}</h1>

// you can still overwrite keyPrefix if you want to use a string that is localised outside the current page, e.g:
<Button>{t('save', { keyPrefix: 'pages.common.actions' })}</Button>
```

For strings that contain other components, the `<Trans>` component is handy:

```js
// string in the translation file
"key": "This string contains a <link>link</link>"


// translation in the component
<Trans i18nKey="key" components={{
    link: (<a href="https://example.com" />)
  }}
/>

// this will output:
This string contains a <a href="https://example.com">link</a>
```

## Language file structure

The language files are saved in [ketty/server/cofig/languages](https://gitlab.coko.foundation/coko-org/products/ketty/server/-/tree/main/config/languages?ref_type=heads). The file uses a nested JSON structure where each UI element has a `type` and `value` at minimum. Some elements have additional attributes or nested structures depending on their complexity and purpose.

### Pages and layout hierarchy

The file is organised to mirror Ketty's structure, making it easier to find and maintain translations. The top level of the file contains a "pages" object, with each major section of the application represented as a nested object.

```json
{
  "pages": {
    "admin": { ... },
    "aiBookDesigner": { ... },
    "common": { ... },
    "dash": { ... },
    "knowledgeBase": { ... },
    "login": { ... },
    "newBook": { ... },
    "passwordReset": { ... },
    "previewAndPublish": { ... },
    "producer": { ... },
    "signup": { ... }
  }
}
```

### The common section

The "common" section serves a special purpose in our translation system. It contains translations that are used across multiple pages of the application. This approach:

- Reduces duplication
- Ensures consistency
- Simplifies maintenance
- Centralises shared UI elements.

For example, form elements like email and password inputs appear on multiple pages (login, signup, password reset). Instead of duplicating these translations, they are stored once in the common section:

```json
{
  "pages": {
    "common": {
      "form": {
        "email": {
          "type": "input(label)",
          "value": "Email",
          "placeholder": {
            "type": "input(placeholder)",
            "value": "Enter your email address"
          },
          "errors": {
            "noValue": {
              "type": "error",
              "value": "Email is required"
            }
          }
        },
        "password": {
          "type": "input(label)",
          "value": "Password",
          "placeholder": {
            "type": "input(placeholder)",
            "value": "Enter your password"
          },
          "errors": {
            "noValue": {
              "type": "error",
              "value": "Password is required"
            }
          }
        }
      }
    }
  }
}
```

### Form elements

#### Input fields

Here's how to handle an input field's translation structure:

```json
{
  "email": {
    "type": "input(label)",
    "value": "Email address"
  },
  "placeholder": {
    "type": "input(placeholder)",
    "value": "Enter your email address"
  },
  "explanation": {
    "type": "input(detail)",
    "value": "We'll use this email for account recovery"
  },
  "errors": {
    "noValue": {
      "type": "error",
      "value": "Email is required"
    },
    "invalidEmail": {
      "type": "error",
      "value": "This is not a valid email address"
    }
  }
}
```

#### Selection controls

Selection controls (dropdowns, radio buttons, and checkboxes) are used when users need to choose from predefined options. They have a more complex structure that includes the label, options, and often additional explanatory text.

```json
{
  "format": {
    "type": "select(label)",
    "value": "Format:"
  },
  "options": {
    "pdf": {
      "value": "PDF"
    },
    "epub": {
      "value": "EPUB"
    },
    "web": {
      "value": "Web"
    }
  },
  "explanation": {
    "type": "select(detail)",
    "value": "Choose the format for your book export"
  }
}
```

For complex options that need additional explanation:

```json
{
  "license": {
    "type": "select(label)",
    "value": "Copyright license"
  },
  "options": {
    "allRightsReserved": {
      "value": "All Rights Reserved",
      "detail": {
        "type": "option(detail)",
        "value": "Your work cannot be distributed without your express consent"
      }
    },
    "creativeCommons": {
      "value": "Creative Commons",
      "detail": {
        "type": "option(detail)",
        "value": "Some rights are reserved based on the specific license you select"
      }
    }
  }
}
```

#### Toggle switches

Switches are used for binary settings (on/off, enable/disable). They often need both a label and an explanation of their effects:

```json
        "aiDesigner": {
          "type": "switch(label)",
          "value": "AI Book Designer (Beta)",
          "detail": {
            "type": "switch(detail)",
            "value": "Users with edit access to this book can use AI writing prompts."
          }
        }
```

### Navigation elements

#### Menus

Menus organise navigation and actions. They can include different types of items:

- Use `link(text)` for navigation to other pages
- Use `action` for operations like logout or delete

```json
{
  "menu": {
    "type": "menu",
    "options": {
      "admin": {
        "type": "link(text)",
        "value": "Admin"
      },
      "logout": {
        "type": "action",
        "value": "Log Out"
      },
      "dashboard": {
        "type": "link(text)",
        "value": "Dashboard"
      }
    }
  }
}
```

### System messages and notifications

#### Simple messages

Use the `message` type for simple status updates or state information:

```json
{
  "status": {
    "type": "message",
    "value": "Last synced %{timestamp}"
  }
}
```

#### Notifications

Use the notifications structure for more complex messages that appear on pop ups and might need titles or different severity levels:

```json
{
  "notifications": {
    "previewFailed": {
      "title": {
        "type": "title",
        "value": "Preview failed"
      },
      "messages": {
        "401": {
          "type": "error",
          "value": "Error 401: There was a problem authenticating with the Flax microservice. Please contact your administrator."
        }
      }
    }
  }
}
```

### Page structure elements

### Titles and headings

```json
{
  "title": {
    "type": "title",
    "value": "Create New Book"
  },
  "sections": {
    "upload": {
      "heading": {
        "type": "heading",
        "value": "Upload your files"
      },
      "description": {
        "type": "detail",
        "value": "Start your book with .docx files"
      }
    }
  }
}
```

### Placeholders and empty states

Use placeholders to guide users when content is missing or not yet created:

```json
{
  "new": {
    "type": "placeholder",
    "value": "Untitled chapter"
  }
}
```
