/* eslint-disable global-require, no-param-reassign */
const { logger } = require('@coko/server')
const jwt = require('jsonwebtoken')
const config = require('config')

const { cleanUpLocks } = require('./bookComponentLock.service')

const userExists = async userId => {
  try {
    const User = require('../models/user/user.model')
    logger.info('executing userExists')

    if (!userId) {
      return false
    }

    const foundUser = await User.findById(userId)

    return foundUser || false
  } catch (e) {
    throw new Error(e)
  }
}

const isAuthenticatedUser = async token => {
  try {
    logger.info('executing isAuthenticatedUser')

    const decoded = jwt.verify(token, config.get('secret'))

    return userExists(decoded.id)
  } catch (e) {
    throw new Error(e)
  }
}

const establishConnection = async (ws, req) => {
  try {
    const WSServerURL = config.has('WSServerURL')
      ? config.get('WSServerURL')
      : undefined

    if (!WSServerURL)
      throw new Error('WSServerURL variable should not be undefined')

    const url = new URL(req.url, WSServerURL)

    const token = url.searchParams.get('token')
    const bookComponentId = url.searchParams.get('bookComponentId')
    const tabId = url.searchParams.get('tabId')
    const user = await isAuthenticatedUser(token)

    if (!user) {
      ws.close()
    }

    ws.userId = user.id
    ws.bookComponentId = bookComponentId
    ws.tabId = tabId
  } catch (e) {
    ws.close()
  }
}

const heartbeat = ws => (ws.isAlive = true)

const initializeHeartbeat = async WSServer => {
  try {
    return setInterval(async () => {
      WSServer.clients.forEach(ws => {
        if (ws.isAlive === false) {
          logger.info(`########### BROKEN CONNECTION DETECTED ###########`)
          logger.info(
            `ws connection is broken for book component with id ${ws.bookComponentId} and userId ${ws.userId}`,
          )
          return ws.terminate()
        }

        ws.isAlive = false

        return ws.ping()
      })
    }, config.get('wsHeartbeatInterval') || 5000)
  } catch (e) {
    throw new Error(e)
  }
}

const initializeFailSafeUnlocking = async WSServer => {
  try {
    return setInterval(
      async () => cleanUpLocks(),
      config.get('failSafeUnlockingInterval') || 7000,
    )
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = {
  establishConnection,
  heartbeat,
  initializeHeartbeat,
  initializeFailSafeUnlocking,
  isAuthenticatedUser,
}
