exports.up = knex => {
  return knex.raw('CREATE EXTENSION IF NOT EXISTS vector;')
}

exports.down = knex => {
  return knex.raw('DROP EXTENSION IF EXISTS vector;')
}
