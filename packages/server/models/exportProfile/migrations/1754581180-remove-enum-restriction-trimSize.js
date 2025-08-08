const { logger } = require('@coko/server')

exports.up = async knex => {
  try {
    return knex.schema.alterTable('export_profiles', table => {
      table.string('trimSize').nullable().defaultTo(null).alter()
    })
  } catch (e) {
    logger.error(e)
    throw new Error(
      `Migration: Export Profiles: Alter column 'trimSize' to type string failed`,
    )
  }
}

exports.down = async knex => {
  try {
    return knex.schema.alterTable('export_profiles', table => {
      table
        .enu('trimSize', ['8.5x11', '6x9', '5.5x8.5'], {
          useNative: true,
          enumName: 'export_profile_trim_size_type',
        })
        .nullable()
        .defaultTo(null)
        .alter()
    })
  } catch (e) {
    logger.error(e)
    throw new Error(
      `Migration: Export Profiles: Alter column 'trimSize' to enum failed`,
    )
  }
}
