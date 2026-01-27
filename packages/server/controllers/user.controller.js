const { logger, useTransaction, createJWT } = require('@coko/server')
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcrypt')

const {
  identityVerification,
} = require('@coko/server/src/models/_helpers/emailTemplates')

const {
  notify,
  notificationTypes: { EMAIL },
} = require('@coko/server/src/services')

const { login } = require('@coko/server/src/models/user/user.controller')
const includes = require('lodash/includes')
const get = require('lodash/get')
const startsWith = require('lodash/startsWith')
const crypto = require('crypto')
const config = require('config')

const BCRYPT_COST = config.util.getEnv('NODE_ENV') === 'test' ? 1 : 12
const Identity = require('@coko/server/src/models/identity/identity.model')
const User = require('../models/user/user.model')

const { createFile, deleteFiles } = require('./file.controller')

const isValidUser = ({ surname, givenNames }) => surname && givenNames

const isAdmin = async userId => {
  try {
    return User.hasGlobalRole(userId, 'admin')
  } catch (e) {
    throw new Error(e)
  }
}

const isGlobal = async (userId, includeAdmin = false) => {
  const globalTeams = config.get('teams.global')

  try {
    let globalTeamItems = globalTeams

    if (!includeAdmin) {
      globalTeamItems = globalTeamItems.filter(team => team.role !== 'admin')
    }

    const isGlobalList = await Promise.all(
      globalTeamItems.map(async team => User.hasGlobalRole(userId, team.role)),
    )

    return isGlobalList.some(global => global)
  } catch (e) {
    throw new Error(e)
  }
}

const ketidaLogin = async input => {
  try {
    const { username, email } = input
    let verified
    let active
    let responseCode

    if (!username) {
      const identity = await Identity.findOne({ email })
      if (!identity) throw new Error('Wrong username or password.')
      verified = identity.isVerified
      const user = await User.findById(identity.userId)
      active = user.isActive
    } else {
      const user = await User.findOne({ username })
      if (!user) throw new Error('Wrong username or password.')
      active = user.isActive

      const identity = await Identity.findOne({
        userId: user.id,
        isDefault: true,
      })

      if (!identity) throw new Error('Something went wrong with provided info')

      verified = identity.isVerified
    }

    if (active && verified) {
      return login(input)
    }

    if (!active && !verified) {
      responseCode = 100
    } else if (!active && verified) {
      responseCode = 110
    } else if (active && !verified) {
      responseCode = 120
    }

    return { code: responseCode }
  } catch (e) {
    logger.error(`[USER CONTROLLER] - ketida login: ${e.message}`)
    throw new Error(e.message)
  }
}

const ketidaResendVerificationEmail = async (email, options = {}) => {
  try {
    const { trx } = options
    logger.info(
      `[USER CONTROLLER] - ketidaResendVerificationEmail: resending verification email to user`,
    )
    return useTransaction(
      async tr => {
        const identity = await Identity.findOne(
          {
            email,
          },
          { trx: tr },
        )

        if (!identity)
          throw new Error(
            `[USER CONTROLLER] - ketidaResendVerificationEmail: Token does not correspond to an identity`,
          )

        const verificationToken = crypto.randomBytes(64).toString('hex')
        const verificationTokenTimestamp = new Date()

        await identity.patch(
          {
            verificationToken,
            verificationTokenTimestamp,
          },
          { trx: tr },
        )

        const emailData = identityVerification({
          verificationToken,
          email: identity.email,
        })

        notify(EMAIL, emailData)

        return true
      },
      { trx, passedTrxOnly: true },
    )
  } catch (e) {
    logger.error(
      `[USER CONTROLLER] - ketidaResendVerificationEmail: ${e.message}`,
    )
    throw new Error(e)
  }
}

const searchForUsers = async (
  search,
  exclude,
  exactMatch = false,
  options = {},
) => {
  try {
    const { trx } = options
    return useTransaction(
      async tr => {
        const res = []

        if (!search) {
          return res
        }

        const searchLow = search.toLowerCase()

        if (exactMatch) {
          return User.query(tr)
            .leftJoin('identities', 'identities.user_id', 'users.id')
            .where({
              'users.is_active': true,
              'identities.is_verified': true,
              'identities.is_default': true,
              'identities.email': searchLow,
            })
            .whereNotIn('users.id', exclude)
            .skipUndefined()
        }

        const { result: allUsers } = await User.find(
          { isActive: true },
          { trx: tr, related: 'defaultIdentity' },
        )

        if (searchLow.length <= 3) {
          logger.info(
            `>>> searching for users where either their username, surname, or email starts with ${searchLow}`,
          )

          await Promise.all(
            allUsers.map(async user => {
              const userClone = { ...user }
              const isUserAdmin = await isAdmin(user.id)

              if (isUserAdmin) return
              userClone.email = userClone.defaultIdentity.email

              if (isValidUser(userClone)) {
                if (
                  (startsWith(
                    get(userClone, 'username', '').toLowerCase(),
                    searchLow,
                  ) ||
                    startsWith(
                      get(userClone, 'surname', '').toLowerCase(),
                      searchLow,
                    ) ||
                    startsWith(
                      get(userClone, 'email', '').toLowerCase(),
                      searchLow,
                    )) &&
                  !includes(exclude, userClone.id)
                ) {
                  logger.info(
                    `>>> found user with id ${userClone.id} who meets the criteria`,
                  )
                  res.push(userClone)
                }
              } else if (
                (startsWith(
                  get(userClone, 'username', '').toLowerCase(),
                  searchLow,
                ) ||
                  startsWith(
                    get(userClone, 'email', '').toLowerCase(),
                    searchLow,
                  )) &&
                !includes(exclude, userClone.id)
              ) {
                logger.info(
                  `>>> found user with id ${userClone.id} who meets the criteria`,
                )
                res.push(userClone)
              }
            }),
          )
        } else if (searchLow.length > 3) {
          logger.info(
            `>>> searching for users where either their username, surname, or email contains ${searchLow}`,
          )
          await Promise.all(
            allUsers.map(async user => {
              const userClone = { ...user }
              const isUserAdmin = await isAdmin(user.id)

              if (isUserAdmin) return

              userClone.email = userClone.defaultIdentity.email

              if (isValidUser(userClone)) {
                const fullname = `${userClone.givenNames} ${userClone.surname}`

                if (
                  (get(userClone, 'username', '')
                    .toLowerCase()
                    .includes(searchLow) ||
                    get(userClone, 'surname', '')
                      .toLowerCase()
                      .includes(searchLow) ||
                    get(userClone, 'email', '')
                      .toLowerCase()
                      .includes(searchLow) ||
                    fullname.toLowerCase().includes(searchLow)) &&
                  !includes(exclude, userClone.id)
                ) {
                  logger.info(
                    `>>> found user with id ${userClone.id} who meets the criteria`,
                  )
                  res.push(userClone)
                }
              } else if (
                (get(userClone, 'username', '')
                  .toLowerCase()
                  .includes(searchLow) ||
                  get(userClone, 'email', '')
                    .toLowerCase()
                    .includes(searchLow)) &&
                !includes(exclude, userClone.id)
              ) {
                logger.info(
                  `>>> found user with id ${userClone.id} who meets the criteria`,
                )
                res.push(userClone)
              }
            }),
          )
        }

        return res
      },
      { trx, passedTrxOnly: true },
    )
  } catch (e) {
    throw new Error(e)
  }
}

const getIdentityByToken = async (token, options = {}) => {
  try {
    const { trx } = options
    return useTransaction(
      async tr => {
        const identity = await Identity.findOne(
          {
            verificationToken: token,
          },
          { trx: tr },
        )

        if (!identity) throw new Error(`getIdentityByToken: identity not found`)

        return identity
      },
      { trx, passedTrxOnly: true },
    )
  } catch (e) {
    throw new Error(e)
  }
}

const updateUserProfile = async data => {
  try {
    logger.info(`[USER CONTROLLER] - updateUserProfile `)
    return useTransaction(async tr => {
      const { id, givenNames, surname, email, avatar, avatarAlt } = data

      const identity = await Identity.findOne(
        {
          userId: id,
          isDefault: true,
        },
        { trx: tr },
      )

      if (identity.email !== email) {
        await Identity.patchAndFetchById(
          identity.id,
          {
            email,
          },
          { trx: tr },
        )
      }

      const user = await User.findById(id)
      let avatarId = null

      if (avatar) {
        const { createReadStream, filename } = await avatar
        // check if exists, if so delete old file

        if (user?.avatarId) {
          await deleteFiles([user.avatarId], true)
        }

        const fileStream = createReadStream()

        const uploadedFile = await createFile(
          fileStream,
          filename,
          avatarAlt,
          null,
          [],
          id,
        )

        avatarId = uploadedFile.id
      } else {
        user?.avatarId && (await deleteFiles([user.avatarId], true))
      }

      return User.patchAndFetchById(
        id,
        {
          givenNames,
          surname,
          avatarId,
        },
        { trx: tr },
      )
    })
  } catch (error) {
    logger.info(`[USER CONTROLLER] - updateUserProfile error`)
    throw new Error(error)
  }
}

const filterUsers = async (params = {}, options = {}) => {
  try {
    const { trx, ...restOptions } = options

    return useTransaction(
      async tr => {
        return User.filter(params, {
          trx: tr,
          ...restOptions,
        })
      },
      {
        trx,
        passedTrxOnly: true,
      },
    )
  } catch (e) {
    logger.error('Base model: find failed', e)
    throw new Error(e)
  }
}

const createUserByInvitation = async email => {
  try {
    return useTransaction(async tr => {
      const existingIdentity = await Identity.findOne({ email }, { trx: tr })

      if (existingIdentity) {
        throw new Error('A user with this email already exists')
      }

      const randomPassword = await bcrypt.hash(generatePassword(), BCRYPT_COST)
      const invitationToken = crypto.randomBytes(64).toString('hex')
      // const invitationTokenTimestamp = new Date()

      const newUser = await User.insert(
        {
          username: 'User invited',
          agreedTc: false,
          isActive: true,
          passwordHash: randomPassword,
          invitationToken,
        },
        { trx: tr },
      )

      await Identity.insert(
        {
          userId: newUser.id,
          email,
          isSocial: false,
          isVerified: true,
          isDefault: true,
        },
        { trx: tr },
      )

      const clientUrl = `${config.get('clientUrl')}`

      const invitationUrl = `${clientUrl}/invitation/${invitationToken}`

      const emailData = {
        subject: 'Invitation to join Ketty',
        to: email,
        content: `
          <p>You have been invited to join the Ketty instance at ${clientUrl}</p>
          <p>Click the following link to set up your account:</p>
          <a href="${invitationUrl}">${invitationUrl}</a>
          <p>If you cannot click the link above, copy and paste the link below into your browser to continue:</p>
          <span>${invitationUrl}</span>
        `,
      }

      notify(EMAIL, emailData)

      return newUser
    })
  } catch (error) {
    throw new Error(error)
  }
}

const userByInvitationToken = async invitationToken => {
  try {
    logger.info('[USER CONTROLLER] - userByInvitationToken')

    return User.findOne({
      invitationToken,
    })
  } catch (error) {
    throw new Error(error)
  }
}

const setupAccountOnInvitation = async ({
  id,
  givenNames,
  surname,
  password,
  agreedTc,
}) => {
  try {
    return useTransaction(async tr => {
      logger.info(
        '[USER CONTROLLER] - Setting up user account after invitation',
      )

      const user = await User.findById(id)

      await User.patchAndFetchById(
        id,
        {
          givenNames,
          surname,
          username: `${givenNames} ${surname}`,
          agreedTc,
          invitationToken: `used_${user.invitationToken}`, // set as empty string because invitationToken is defined as stringNotEmpty
        },
        { trx: tr },
      )

      await user.updatePassword(undefined, password, user.passwordResetToken, {
        trx: tr,
      })

      return {
        user,
        token: createJWT(user),
      }
    })
  } catch (error) {
    throw new Error(error)
  }
}

const resendInvitation = async userId => {
  try {
    logger.info('[USER CONTROLLER] - resendInvitation')

    const user = await User.findById(userId)

    const userIdentity = await Identity.findOne({
      userId,
    })

    const clientUrl = `${config.get('clientUrl')}`

    const invitationUrl = `${clientUrl}/invitation/${user?.invitationToken}`

    const emailData = {
      subject: 'Invitation to join Ketty',
      to: userIdentity?.email,
      content: `
          <p>You have been invited to join the Ketty instance at ${clientUrl}</p>
          <p>Click the following link to set up your account:</p>
          <a href="${invitationUrl}">${invitationUrl}</a>
          <p>If you cannot click the link above, copy and paste the link below into your browser to continue:</p>
          <span>${invitationUrl}</span>
        `,
    }

    notify(EMAIL, emailData)
    return true
  } catch (error) {
    throw new Error(error)
  }
}

const cancelInvitation = async userId => {
  try {
    return useTransaction(async tr => {
      logger.info('[USER CONTROLLER] - cancelInvitation')

      await Identity.query(tr).delete().where({ userId })
      await User.deleteById(userId, { trx: tr })

      return true
    })
  } catch (error) {
    throw new Error(error)
  }
}

function generatePassword() {
  const length = 8

  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

  let retVal = ''
  const n = charset.length

  for (let i = 0; i < length; i += 1) {
    retVal += charset.charAt(Math.floor(Math.random() * n))
  }

  return retVal
}

module.exports = {
  searchForUsers,
  isAdmin,
  ketidaLogin,
  ketidaResendVerificationEmail,
  isGlobal,
  getIdentityByToken,
  updateUserProfile,
  filterUsers,
  createUserByInvitation,
  userByInvitationToken,
  setupAccountOnInvitation,
  resendInvitation,
  cancelInvitation,
}
