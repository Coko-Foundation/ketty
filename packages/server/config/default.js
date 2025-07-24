const components = require('./components')
const bbVanilla = require('./modules/bookBuilderVanilla')
const bbOEN = require('./modules/bookBuilderOEN')
const bbBooksprints = require('./modules/bookBuilderBooksprints')
const oenTeams = require('./modules/oenTeams')
const vanillaTeams = require('./modules/vanillaTeams')
const podTeams = require('./modules/podTeams')
const vanillaFilters = require('./modules/vanillaFilters')
const podFilters = require('./modules/podFilters')
const booksprintTeams = require('./modules/booksprintTeams')
const vanillaPermissions = require('./permissions/vanilla.permissions')
const booksprintPermissions = require('./permissions/booksprint.permissions')
const oenPermissions = require('./permissions/oen.permissions')
const podPermissions = require('./permissions/pod.permissions')
const startUpScripts = require('./startUp')
const jobQueues = require('./jobQueues')

const flavour =
  process.env.KETIDA_FLAVOUR && process.env.KETIDA_FLAVOUR === 'BOOKSPRINTS'
    ? 'BOOKSPRINTS'
    : 'VANILLA'

const featureBookStructureEnabled =
  (process.env.FEATURE_BOOK_STRUCTURE &&
    JSON.parse(process.env.FEATURE_BOOK_STRUCTURE)) ||
  false

const featurePODEnabled =
  (process.env.FEATURE_POD && JSON.parse(process.env.FEATURE_POD)) || false

let bookBuilder
let flavorPermissions = vanillaPermissions

if (!featureBookStructureEnabled) {
  if (flavour === 'BOOKSPRINTS') {
    bookBuilder = bbBooksprints
    flavorPermissions = booksprintPermissions
  } else {
    bookBuilder = bbVanilla
  }
} else {
  flavorPermissions = oenPermissions
  bookBuilder = bbOEN
}

let flavorTeams = oenTeams

if (!featureBookStructureEnabled) {
  flavorTeams = flavour === 'BOOKSPRINTS' ? booksprintTeams : vanillaTeams
}

let filters = vanillaFilters

if (featurePODEnabled) {
  flavorTeams = podTeams
  flavorPermissions = podPermissions
  filters = podFilters
}

module.exports = {
  bookBuilder,
  passwordReset: {
    pathToPage: '/password-reset',
  },
  featureBookStructure: false,
  flavour,
  featureUploadDOCXFiles: true,
  permissions: flavorPermissions,
  filters,
  components,
  useGraphQLServer: true,
  useFileStorage: true,
  tokenExpiresIn: '360 days',
  pool: { min: 0, max: 10, idleTimeoutMillis: 1000 },
  teams: flavorTeams,
  tempDirectoryCleanUp: true,
  wsHeartbeatInterval: 5000,
  WSServerPort: 3333,
  failSafeUnlockingInterval: 7000,

  onStartup: startUpScripts,
  devServerIgnore: ['./templates/*'],
  jobQueues,

  staticFolders: [
    {
      folderPath: './config/languages',
      mountPoint: '/languages',
    },
    {
      folderPath: './tmp',
      mountPoint: '/tmp',
    },
  ],
}
