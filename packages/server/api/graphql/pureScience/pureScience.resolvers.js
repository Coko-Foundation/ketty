const { logger } = require('@coko/server')

const {
  getApplicationParameters,
} = require('../../../controllers/applicationParameter.controller')

const triggerWorkflowResolver = async (_, { token, data }) => {
  logger.info('Triggering PS workflow with webhook token id:', token)

  try {
    const query = `mutation {
        triggerWebhook(
          token: "${token}",
          data: ${JSON.stringify(data)}
        ) {
          success
          runId
          message
          error
        }
      }
    `

    const payload = JSON.stringify({ query })

    const integrations = await getApplicationParameters(
      'bookBuilder',
      'integrations',
    )

    const psConfigUrl = integrations[0].config?.pureScience?.url

    const response = await fetch(psConfigUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload,
    })

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }

    return true
  } catch (error) {
    logger.error(error)
    return false
  }
}

module.exports = {
  Mutation: {
    triggerWorkflow: triggerWorkflowResolver,
  },
}
