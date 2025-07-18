const { useTransaction, logger, uuid } = require('@coko/server')

const {
  notify,
  notificationTypes: { EMAIL },
} = require('@coko/server/src//services')

const { bookInvite } = require('./helpers/emailTemplates')

const { Invitations, Book } = require('../models').models

const sendInvitations = async (invitationData, userId, options = {}) => {
  try {
    const { trx } = options
    logger.info(`sendInvitations: to ${invitationData.members.join(', ')}`)

    const book = await Book.getUserBookDetails(userId, invitationData.bookId, {
      trx,
    })

    const invitations = invitationData.members.map(member => ({
      teamId: invitationData.teamId,
      email: member,
      status: invitationData.status,
      bookId: book.id,
    }))

    const emailInvitations = invitations.map(invitation =>
      bookInvite({
        email: invitation.email,
        bookTitle: book.title,
        sharerEmail: book.email,
        sharerName: book.name,
        bookId: book.id,
        status: invitation.status,
      }),
    )

    // Using Promise.all b/c batchInsert is not implemented in @coko/server
    return Promise.all(
      invitations.map(async invitation => {
        return useTransaction(
          async tr => Invitations.insert(invitation, { trx: tr }),
          {
            trx,
          },
        )
      }),
    )
      .then(() => {
        // Send email invitations
        Promise.all(emailInvitations.map(email => notify(EMAIL, email)))

        return getInvitations(book.id)
      })
      .catch(() => {
        throw new Error('Invitation already sent.')
      })
  } catch (e) {
    throw new Error(e)
  }
}

const deleteInvitation = async (bookId, email, options = {}) => {
  try {
    const { trx } = options
    logger.info(`deleteInvitation: email ${email}`)

    return useTransaction(
      async tr => Invitations.query(tr).where({ email, bookId }).del(),
      {
        trx,
      },
    ).then(() => getInvitations(bookId))
  } catch (e) {
    throw new Error(e)
  }
}

const getInvitations = async (bookId, options = {}) => {
  try {
    const { trx } = options
    logger.info(`getInvitations: for book ${bookId}`)

    return useTransaction(
      async tr => {
        const invitations = await Invitations.query(tr).where({ bookId })

        return [
          {
            id: uuid(),
            role: 'invitations',
            members: invitations?.map(invitation => ({
              status: invitation.status,
              id: invitation.id,
              user: {
                id: uuid(),
                displayName: invitation.email,
                email: invitation.email,
              },
            })),
          },
        ]
      },
      {
        trx,
      },
    )
  } catch (e) {
    throw new Error(e)
  }
}

const updateInvitation = async (bookId, email, status, options = {}) => {
  try {
    const { trx } = options
    logger.info(`updateInvitation: email ${email} status ${status}`)

    return useTransaction(
      async tr => Invitations.query(tr).where({ email }).patch({ status }),
      {
        trx,
      },
    ).then(() => getInvitations(bookId))
  } catch (e) {
    throw new Error(e)
  }
}

const getEmailInvitations = async (email, options = {}) => {
  try {
    const { trx } = options
    logger.info(`getEmailInvitations: for email ${email}`)

    return useTransaction(async tr => Invitations.query(tr).where({ email }), {
      trx,
    })
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = {
  sendInvitations,
  deleteInvitation,
  getInvitations,
  getEmailInvitations,
  updateInvitation,
}
