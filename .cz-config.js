const { commitizen } = require('@coko/lint')

commitizen.scopes = ['client', 'server', 'docs', 'root', '*']

module.exports = commitizen
