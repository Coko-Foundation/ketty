const {
  getUserFileManagerHandler,
  getObjectFileManagerHandler,
  uploadToFileManagerHandler,
  deleteFromFileManagerHandler,
  updateMetadataFileManagerHandler,
  updateComponentIdInFileManagerHandler,
} = require('../../../controllers/fileManager.controller')

module.exports = {
  Query: {
    getUserFileManager: getUserFileManagerHandler,
    getObjectFileManager: getObjectFileManagerHandler,
  },
  Mutation: {
    uploadToFileManager: uploadToFileManagerHandler,
    deleteFromFileManager: deleteFromFileManagerHandler,
    updateMetadataFileManager: updateMetadataFileManagerHandler,
    updateComponentIdInFileManager: updateComponentIdInFileManagerHandler,
  },
}
