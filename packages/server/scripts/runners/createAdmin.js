#!/usr/bin/env node

const seedAdmin = require('../seeds/admin')

const run = async () => {
  try {
    return seedAdmin()
  } catch (e) {
    throw new Error(e.message)
  }
}

run()
