const { logger } = require('@coko/server')

exports.up = async knex => {
  try {
    // add avatarId field
    await knex.schema.table('users', table => {
      table.uuid('avatarId').defaultTo(null)
    })
  } catch (e) {
    logger.error(e)
    throw new Error(`Migration: User: add "avatarId" failed`)
  }
}

exports.down = async knex => {
  try {
    return knex.schema.table('users', table => {
      table.dropColumn('avatarId')
    })
  } catch (e) {
    logger.error(e)
    throw new Error(`Migration: User: removing column 'avatarId' failed`)
  }
}
