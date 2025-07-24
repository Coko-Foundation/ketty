const { subscriptionManager, logger } = require('@coko/server')

const { BOOK_COMPONENT_ORDER_UPDATED } = require('./constants')

const { BOOK_UPDATED } = require('../book/constants')

const {
  updateBookComponentOrder,
  updateBookComponentsOrder,
  getDivision,
} = require('../../../controllers/division.controller')

const DivisionLoader = require('../../../models/dataloader/loaders/divisionLoader')

const updateBookComponentOrderHandler = async (
  _,
  { targetDivisionId, bookComponentId, index },
) => {
  try {
    logger.info(
      'division resolver: executing updateBookComponentOrder use case',
    )

    const book = await updateBookComponentOrder(
      targetDivisionId,
      bookComponentId,
      index,
    )

    subscriptionManager.publish(BOOK_COMPONENT_ORDER_UPDATED, {
      bookComponentOrderUpdated: book.id,
    })

    subscriptionManager.publish(BOOK_UPDATED, {
      bookUpdated: book.id,
    })

    return book
  } catch (e) {
    throw new Error(e)
  }
}

const updateBookComponentsOrderHandler = async (
  _,
  { targetDivisionId, bookComponents },
) => {
  try {
    logger.info(
      'division resolver: executing updateBookComponentsOrder use case',
    )

    const book = await updateBookComponentsOrder(
      targetDivisionId,
      bookComponents,
    )

    subscriptionManager.publish(BOOK_COMPONENT_ORDER_UPDATED, {
      bookComponentOrderUpdated: book.id,
    })

    subscriptionManager.publish(BOOK_UPDATED, {
      bookUpdated: book.id,
    })

    return book
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = {
  Mutation: {
    updateBookComponentOrder: updateBookComponentOrderHandler,
    updateBookComponentsOrder: updateBookComponentsOrderHandler,
  },
  Division: {
    async bookComponents(divisionId, _, ctx) {
      await DivisionLoader.bookComponents.clear()
      return DivisionLoader.bookComponents.load(divisionId)
    },
    async label(divisionId) {
      const dbDivision = await getDivision(divisionId)
      return dbDivision.label
    },
    async id(divisionId) {
      return divisionId
    },
  },
  Subscription: {
    bookComponentOrderUpdated: {
      subscribe: async () => {
        return subscriptionManager.asyncIterator(BOOK_COMPONENT_ORDER_UPDATED)
      },
    },
  },
}
