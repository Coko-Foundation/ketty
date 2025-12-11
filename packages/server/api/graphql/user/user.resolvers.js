const { logger } = require('@coko/server')

const {
  searchForUsers,
  isAdmin,
  ketidaLogin,
  ketidaResendVerificationEmail,
  isGlobal,
  updateUserProfile,
  filterUsers,
} = require('../../../controllers/user.controller')

const { getBooks } = require('../../../controllers/book.controller')

const searchForUsersHandler = async (
  _,
  { search, exclude, exactMatch },
  ctx,
  info,
) => {
  try {
    logger.info('user resolver: executing searchForUsers use case')

    return searchForUsers(search, exclude, exactMatch)
  } catch (e) {
    throw new Error(e)
  }
}

const ketidaLoginHandler = async (_, { input }) => {
  try {
    return ketidaLogin(input)
  } catch (e) {
    throw new Error(e.message)
  }
}

const ketidaRequestVerificationEmailHandler = async (_, { email }) => {
  try {
    logger.info(`[USER RESOLVER] - ketidaResendVerificationEmail`)
    return ketidaResendVerificationEmail(email)
  } catch (e) {
    logger.error(
      `[USER RESOLVER] - ketidaResendVerificationEmail: ${e.message}`,
    )
    throw new Error(e)
  }
}

const updateUserProfileResolver = async (_, { input }) => {
  return updateUserProfile(input)
}

const filterUsersResolver = async (_, { filter, pagination }) => {
  try {
    return filterUsers(filter, pagination)
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = {
  Query: {
    filterUsers: filterUsersResolver,
  },
  Mutation: {
    searchForUsers: searchForUsersHandler,
    ketidaLogin: ketidaLoginHandler,
    ketidaRequestVerificationEmail: ketidaRequestVerificationEmailHandler,
    updateUserProfile: updateUserProfileResolver,
  },
  User: {
    async admin(user) {
      logger.info('in custom resolver')
      return isAdmin(user.id)
    },
    async isGlobal(user) {
      logger.info('isGlobal resolver')
      return isGlobal(user.id)
    },
    async books(user) {
      const books = await getBooks({
        userId: user.id,
        options: {
          showArchived: false,
          orderBy: { column: 'title', order: 'asc' },
          page: 0,
          pageSize: 100,
        },
      })

      return books.result
    },
  },
}
