const fs = require('fs')
const path = require('path')
const resolvers = require('./pureScience.resolvers')

module.exports = {
  resolvers,
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'pureScience.graphql'),
    'utf-8',
  ),
}
