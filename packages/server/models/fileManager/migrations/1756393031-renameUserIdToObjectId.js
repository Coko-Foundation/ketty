const { logger } = require('@coko/server')

exports.up = knex => {
  try {
    return knex.schema.table('file_manager', table => {
      table.dropForeign('userId')
      table.renameColumn('userId', 'objectId')
    })
  } catch (error) {
    logger.error(error)
    throw new Error(
      `Migration: FileManager: renaming column userId to objectId failed`,
    )
  }
}

exports.down = knex => {
  return knex.schema.table('file_manager', table => {
    table.renameColumn('objectId', 'userId')
  })
}
