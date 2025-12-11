const { commitizen } = require('@coko/lint')

commitizen.scopes = ['client', 'server', 'pandoc', 'docs', 'root', '*']

module.exports = commitizen
