const { logger, useTransaction } = require('@coko/server')

exports.up = async knex => {
  try {
    return useTransaction(async trx => {
      await knex('template').transacting(trx).update({
        notes: 'chapterEnd',
      })
    })
  } catch (e) {
    logger.error(e)
    throw new Error(
      'Migration: Template: changing notes type to chapterEnd failed.',
    )
  }
}

exports.down = async knex => {
  try {
    return useTransaction(async trx => {
      await knex('template').transacting(trx).update({
        notes: 'footnotes',
      })
    })
  } catch (e) {
    logger.error(e)
    throw new Error(
      `Migration: Template: changing notes type to footnotes failed`,
    )
  }
}
