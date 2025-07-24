/*
  TO DO

  Update division's "bookComponents" array of ids on insert.

  Read valid component type values from config and make it an enum
*/

const { Model } = require('objection')

const { uuid } = require('@coko/server')

const Base = require('../ketidaBase')

const { boolean, booleanDefaultFalse, id, integerPositive, string } =
  require('../helpers').schema

class BookComponent extends Base {
  constructor(properties) {
    super(properties)
    this.type = 'bookComponent'
  }

  static get tableName() {
    return 'BookComponent'
  }

  static get relationMappings() {
    /* eslint-disable global-require */
    const Book = require('../book/book.model')
    const Division = require('../division/division.model')
    const BookComponentState = require('../bookComponentState/bookComponentState.model')
    /* eslint-enable global-require */
    return {
      book: {
        relation: Model.BelongsToOneRelation,
        modelClass: Book,
        join: {
          from: 'BookComponent.bookId',
          to: 'Book.id',
        },
      },
      division: {
        relation: Model.BelongsToOneRelation,
        modelClass: Division,
        join: {
          from: 'BookComponent.divisionId',
          to: 'Division.id',
        },
      },
      bookComponentState: {
        relation: Model.BelongsToOneRelation,
        modelClass: BookComponentState,
        join: {
          from: 'BookComponent.id',
          to: 'BookComponentState.bookComponentId',
        },
      },
    }
  }

  static get schema() {
    return {
      type: 'object',
      required: ['bookId', 'componentType', 'divisionId'],
      properties: {
        archived: booleanDefaultFalse,
        bookId: id,
        /*
          component type (eg. 'chapter', 'part' etc) needs to be loose, as
          its accepted values are configurable
          OR read from config (doable?)
        */
        componentType: string,
        parentComponentId: id,
        divisionId: id,
        pagination: {
          type: 'object',
          properties: {
            left: boolean,
            right: boolean,
          },
          default: {
            left: false,
            right: false,
          },
        },
        referenceId: id,

        /*
          counters
        */
        equationCounter: integerPositive,
        figureCounter: integerPositive,
        noteCounter: integerPositive,
        pageCounter: integerPositive,
        tableCounter: integerPositive,
        wordCounter: integerPositive,
      },
    }
  }

  /*
    If there is no reference id, assume it is a new component and generate one.
  */
  $beforeInsert() {
    super.$beforeInsert()
    this.referenceId = this.referenceId || uuid()
  }

  getBook() {
    return this.$relatedQuery('book')
  }

  getDivision() {
    return this.$relatedQuery('division')
  }

  getBookComponentState() {
    return this.$relatedQuery('bookComponentState')
  }
}

module.exports = BookComponent
