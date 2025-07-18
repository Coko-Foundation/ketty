/* eslint-disable global-require */

let tempDirectoryCleanUp

try {
  tempDirectoryCleanUp = JSON.parse(process.env.TEMP_DIRECTORY_CLEAN_UP)
} catch (e) {
  tempDirectoryCleanUp = false
}

module.exports = [
  {
    name: 'clean-idle-locks',
    handler: async () => {
      const { cleanUpIdleLocks } = require('../services/cron.service')
      await cleanUpIdleLocks()
    },
    schedule: '*/10 * * * *', // every 10 minutes
  },
  tempDirectoryCleanUp && {
    name: 'temp-directory-cleanup',
    handler: async () => {
      const { tempDirectoryCleanup } = require('../services/cron.service')
      await tempDirectoryCleanup()
    },
    schedule: process.env.TEMP_DIRECTORY_CRON_JOB_SCHEDULE || '0 * * * *', // default to every hour
  },
].filter(Boolean)
