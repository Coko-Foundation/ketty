// should match one of the language `code` field in supportedLanguages
export const defaultLanguage = 'en'

// the language `code` should match the name of the folder where you're adding your translations
// (`/locales/{code}/translations.json`)
// for `flagCode` see this list https://www.iso.org/obp/ui/
export const supportedLanguages = [
  { code: 'en', name: 'English', flagCode: 'gb' },
  // { code: 'es', name: 'Español', flagCode: 'es' },
]
