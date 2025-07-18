// TO DO -- review foreign id and foreign type

const { modelJsonSchemaTypes } = require('@coko/server')

const Base = require('../ketidaBase')
const { id, string } = require('../helpers').schema

const { dateNotNullable } = modelJsonSchemaTypes

const foreignType = {
  type: 'string',
  enum: ['book', 'bookCollection', 'bookComponent', 'division', 'file'],
}

class Lock extends Base {
  constructor(properties) {
    super(properties)
    this.type = 'lock'
  }

  static get tableName() {
    return 'Lock'
  }

  // static get relationMappings() {
  //   /* TO DO -- Implement user relation? */
  // }

  static get schema() {
    return {
      type: 'object',
      required: ['foreignId', 'userId', 'tabId'],
      properties: {
        foreignId: id,
        foreignType,
        userAgent: string,
        userId: id,
        tabId: id,
        lastActiveAt: dateNotNullable,
      },
    }
  }
}

module.exports = Lock
