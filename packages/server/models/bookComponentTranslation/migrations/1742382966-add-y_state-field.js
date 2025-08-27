const { logger } = require('@coko/server')

exports.up = async knex => {
  try {
    return knex.schema.table('book_component_translation', table => {
      table.binary('y_state')
    })
  } catch (e) {
    logger.error(e)
    throw new Error(`Migration: BookComponentTranslation: add "yState" failed`)
  }
}

exports.down = async knex => {
  try {
    return knex.schema.table('book_component_translation', table => {
      table.dropColumn('yState')
    })
  } catch (e) {
    logger.error(e)
    throw new Error(`Migration: BookComponentTranslation: drop "yState"`)
  }
}
