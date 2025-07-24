const { logger } = require('@coko/server')

const Lock = require('../lock.model')

exports.up = async knex => {
  try {
    return Lock.query().delete().where({})
  } catch (e) {
    logger.error(e)
    throw new Error(`Migration: Locks: deleting old data failed`)
  }
}
