/*
  An extension of coko server's base model with some bells and whistles.
  All other Ketida models will (and should) extend this class.
*/

const { BaseModel } = require('@coko/server')

class KetidaBase extends BaseModel {
  $beforeInsert() {
    super.$beforeInsert()
    this.deleted = false
  }

  static get schema() {
    return {
      type: 'object',
      properties: {
        deleted: {
          type: 'boolean',
          default: false,
        },
      },
    }
  }
}

module.exports = KetidaBase
