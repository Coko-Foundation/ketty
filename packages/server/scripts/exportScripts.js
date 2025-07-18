const config = require('config')
const isEmpty = require('lodash/isEmpty')

const exportScripts = async () => {
  try {
    const hasScripts =
      config.has('export') &&
      config.has('export.scripts') &&
      !isEmpty(config.get('export.scripts'))

    if (hasScripts) {
      const scripts = config.get('export.scripts')
      const errors = []

      for (let i = 0; i < scripts.length; i += 1) {
        for (let j = i + 1; j < scripts.length; j += 1) {
          if (
            scripts[i].label === scripts[j].label &&
            scripts[i].filename !== scripts[j].filename &&
            scripts[i].scope === scripts[j].scope
          ) {
            errors.push(
              `your have provided the same label (${scripts[i].label}) for two different scripts`,
            )
          }

          if (
            scripts[i].label === scripts[j].label &&
            scripts[i].filename === scripts[j].filename &&
            scripts[i].scope === scripts[j].scope
          ) {
            errors.push(
              `your have declared the script with label (${scripts[i].label}) twice`,
            )
          }
        }
      }

      if (errors.length !== 0) {
        throw new Error(errors)
      }
    }
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = exportScripts
