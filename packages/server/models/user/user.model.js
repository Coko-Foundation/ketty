const { logger, useTransaction, User: UserModel } = require('@coko/server')

class User extends UserModel {
  static async filter(data = {}, options = {}) {
    try {
      const { search, ...otherParams } = data
      const { trx, orderBy, page, pageSize } = options
      return useTransaction(
        async tr => {
          let queryBuilder = this.query(tr)

          if (search) {
            queryBuilder = queryBuilder
              .withGraphJoined('defaultIdentity')
              .where(builder =>
                builder
                  .where('defaultIdentity.email', 'ilike', `%${search}%`)
                  .orWhere('givenNames', 'ilike', `%${search}%`)
                  .orWhere('surname', 'ilike', `%${search}%`),
              )
          }

          queryBuilder = queryBuilder.where(otherParams)

          if (orderBy) {
            queryBuilder = queryBuilder.orderBy(orderBy)
          }

          if (
            (Number.isInteger(page) && !Number.isInteger(pageSize)) ||
            (!Number.isInteger(page) && Number.isInteger(pageSize))
          ) {
            throw new Error(
              'both page and pageSize integers needed for paginated results',
            )
          }

          if (Number.isInteger(page) && Number.isInteger(pageSize)) {
            if (page < 0) {
              throw new Error(
                'invalid index for page (page should be an integer and greater than or equal to 0)',
              )
            }

            if (pageSize <= 0) {
              throw new Error(
                'invalid size for pageSize (pageSize should be an integer and greater than 0)',
              )
            }

            queryBuilder = queryBuilder.page(page, pageSize)
          }

          const result = await queryBuilder
          const { results, total } = result

          return {
            result: page !== undefined ? results : result,
            totalCount: total || result.length,
          }
        },
        {
          trx,
          passedTrxOnly: true,
        },
      )
    } catch (error) {
      logger.error(`error filterUsers: ${error.message}`)
      throw new Error(error)
    }
  }
}

module.exports = User
