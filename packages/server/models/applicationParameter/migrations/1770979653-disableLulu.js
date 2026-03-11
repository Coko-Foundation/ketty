const { logger } = require('@coko/server')

exports.up = async knex => {
  try {
    const config = await knex('application_parameter')
      .select('config')
      .where('area', 'integrations')

    if (config.length) {
      const configObject = JSON.parse(config[0].config)

      if (configObject.lulu) {
        configObject.lulu.disabled = true
        await knex('application_parameter')
          .update({
            config: JSON.stringify(configObject),
          })
          .where('area', 'integrations')
      }
    }
  } catch (error) {
    logger.error('ApplicationParamer: disabling lulu config failed!')
    throw new Error(error)
  }
}

exports.down = async knex => {
  try {
    const config = await knex('application_parameter')
      .select('config')
      .where('area', 'integrations')

    const configObject = JSON.parse(config[0].config)
    configObject.lulu.disabled = false

    await knex('application_parameter')
      .update({
        config: JSON.stringify(configObject),
      })
      .where('area', 'integrations')
  } catch (error) {
    logger.error('ApplicationParamer: enabling lulu config failed!')
    throw new Error(error)
  }
}
