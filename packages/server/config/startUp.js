/* eslint-disable global-require */

const featurePODEnabled =
  (process.env.FEATURE_POD && JSON.parse(process.env.FEATURE_POD)) || false

module.exports = [
  {
    label: 'Seed admin',
    execute: async () => {
      const seedAdmin = require('../scripts/seeds/admin')
      await seedAdmin()
    },
  },
  {
    label: 'Seed application parameters',
    execute: async () => {
      const seedApplicationParameters = require('../scripts/seeds/applicationParameters')
      await seedApplicationParameters()
    },
  },
  featurePODEnabled && {
    label: 'Seed templates',
    execute: async () => {
      const seedTemplates = require('../scripts/seeds/templates')
      await seedTemplates()
    },
  },
  {
    label: 'Clean up locks',
    execute: async () => {
      const { cleanUpLocks } = require('../services/bookComponentLock.service')
      await cleanUpLocks()
    },
  },
  {
    label: 'Start websocket server',
    execute: async () => {
      const { startWSServer } = require('../scripts/startWebSocketServer')
      await startWSServer()
    },
  },
  {
    label: 'Export scripts',
    execute: async () => {
      const exportScripts = require('../scripts/exportScripts')
      await exportScripts()
    },
  },
].filter(Boolean)
