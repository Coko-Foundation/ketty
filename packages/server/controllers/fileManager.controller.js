const { createFile, deleteFiles, logger } = require('@coko/server')
const { FileManager } = require('../models').models
const { getFileURL } = require('./file.controller')
// const DocTreeManager = require('../models/docTreeManager/docTreeManager.model')

const FILE_MANAGER_CONTROLLER = '[FILE MANAGER CONTROLLER]'

const getUserFileManagerHandler = async (_, __, ctx) => {
  const fileManager = await FileManager.query()
    .where({
      objectId: ctx.userId,
      parentId: null,
    })
    .withGraphFetched('file')

  //   const bookComponents = await Promise.all(
  //     fileManager.map(file =>
  //       DocTreeManager.query().whereIn(
  //         'bookComponentId',
  //         file.metadata.bookComponentId,
  //       ),
  //     ),
  //   )

  //   const fileManagerWithBookComponent = fileManager.map((file, fileIndex) => {
  //     const bookComponentChapter = file.metadata.bookComponentId.map(id =>
  //       bookComponents[fileIndex].find(bookComponent => {
  //         return bookComponent && bookComponent.bookComponentId === id
  //       }),
  //     )

  //     return {
  //       ...file,
  //       metadata: {
  //         ...file.metadata,
  //         bookComponentId: bookComponentChapter,
  //       },
  //     }
  //   })

  const filesWithUrl = await Promise.all(
    fileManager.map(async file => {
      const url = await getFileURL(file.fileId, 'medium')
      return { ...file, url }
    }),
  )

  return JSON.stringify(filesWithUrl)
}

const getObjectFileManagerHandler = async (_, { objectId }) => {
  logger.info(
    `${FILE_MANAGER_CONTROLLER} getObjectFileManagerHandler: fetching fileManager for objectId ${objectId}`,
  )

  try {
    const fileManager = await FileManager.query()
      .where({
        objectId,
        parentId: null,
      })
      .withGraphFetched('file')

    const filesWithUrl = await Promise.all(
      fileManager.map(async file => {
        const url = await getFileURL(file.fileId, 'medium')
        return { ...file, url }
      }),
    )

    return JSON.stringify(filesWithUrl)
  } catch (error) {
    throw new Error(error)
  }
}

const uploadToFileManagerHandler = async (_, { files, objectId }, ctx) => {
  const uploadedFiles = []
  await Promise.all(
    files.map(async file => {
      const { createReadStream, filename } = await file
      const fileStream = createReadStream()

      uploadedFiles.push(
        await createFile(
          fileStream,
          filename,
          null,
          null,
          [],
          objectId || ctx.userId,
        ),
      )
    }),
  )

  await Promise.all(
    uploadedFiles.map(async file => {
      await FileManager.insert({
        name: file.name,
        fileId: file.id,
        objectId: objectId || ctx.userId,
        metadata: { bookComponentId: [] },
      })
    }),
  )

  return uploadedFiles
}

const deleteFromFileManagerHandler = async (_, { ids }, ctx) => {
  await FileManager.query().delete().whereIn('fileId', ids)
  await deleteFiles(ids)
}

const updateMetadataFileManagerHandler = async (_, { fileId, input }, ctx) => {
  await FileManager.query()
    .patch({
      metadata: input,
    })
    .where({ fileId })

  return fileId
}

const updateComponentIdInFileManagerHandler = async (
  _,
  { bookComponentId, input },
  ctx,
) => {
  if (input?.added.length > 0) {
    const files = await FileManager.query().whereIn('fileId', input.added)
    await Promise.all(
      files.map(file =>
        FileManager.query()
          .patch({
            metadata: {
              ...file.metadata,
              bookComponentId: [
                ...file.metadata.bookComponentId,
                bookComponentId,
              ],
            },
          })
          .findOne({ id: file.id }),
      ),
    )
  }

  if (input?.removed.length > 0) {
    const files = await FileManager.query().whereIn('fileId', input.removed)
    await Promise.all(
      files.map(file => {
        // Count how many times this bookComponentId appears in input.removed
        const removeCount = input.removed.filter(
          fileId => fileId === file.fileId,
        ).length

        // Create a copy of the bookComponentId array
        const updatedBookComponentId = [...file.metadata.bookComponentId]

        // Remove the bookComponentId as many times as it appears in input.removed
        for (let i = 0; i < removeCount; i += 1) {
          const index = updatedBookComponentId.indexOf(bookComponentId)

          if (index !== -1) {
            updatedBookComponentId.splice(index, 1)
          }
        }

        return FileManager.query()
          .patch({
            metadata: {
              ...file.metadata,
              bookComponentId: updatedBookComponentId,
            },
          })
          .findOne({ id: file.id })
      }),
    )
  }

  return []
}

module.exports = {
  getUserFileManagerHandler,
  getObjectFileManagerHandler,
  uploadToFileManagerHandler,
  deleteFromFileManagerHandler,
  updateMetadataFileManagerHandler,
  updateComponentIdInFileManagerHandler,
}
