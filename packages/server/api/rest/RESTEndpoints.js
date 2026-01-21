const {
  subscriptionManager,
  logger,
  useTransaction,
  tempFolderPath,
} = require('@coko/server')

const fs = require('fs-extra')
const mime = require('mime-types')
const { NotFoundError } = require('objection')

const { readFile } = require('../../utilities/filesystem')
const { xsweetImagesHandler } = require('../../utilities/image')

const {
  BookComponent,
  ServiceCallbackToken,
  Book,
  Division,
  BookComponentTranslation,
  ExportProfile,
} = require('../../models').models

const {
  BOOK_COMPONENT_UPLOADING_UPDATED,
  BOOK_COMPONENT_UPDATED,
  STATUSES,
  BOOK_COMPONENT_CONTENT_UPDATED,
} = require('../graphql/bookComponent/constants')

const { BOOK_UPDATED } = require('../graphql/book/constants')

const {
  updateContent,
  updateUploading,
  // deleteBookComponent,
  getBookComponent,
  setStatus,
  createBookComponentWithContent,
  deleteBookComponent,
  updateBookComponentParentId,
} = require('../../controllers/bookComponent.controller')

const { getBookTOC, exportBook } = require('../../controllers/book.controller')

const updateBookComponent = async (req, res) => {
  try {
    const {
      chapterId: bookComponentId,
      content,
      lang: languageIso = 'en',
    } = req.body

    if (!bookComponentId || !content) {
      res.status(500).json({ error: 'Missing content or chapterId' })
    }

    await updateContent(bookComponentId, content, languageIso)

    subscriptionManager.publish(BOOK_COMPONENT_CONTENT_UPDATED, {
      bookComponentContentUpdated: bookComponentId,
    })

    res.status(200).send('Book component updated successfully')
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const RESTEndpoints = app => {
  app.use('/api/pandoc-callback', async (req, res) => {
    try {
      const { bookComponentId, convertedContent, status, error } = req.body

      if (status === 'error') {
        throw new Error(error)
      }

      // Use existing xsweetImagesHandler to process images and upload to S3
      const contentWithImagesHandled = await xsweetImagesHandler(
        convertedContent,
        bookComponentId,
      )

      const uploading = false
      await updateContent(bookComponentId, contentWithImagesHandled, 'en')
      await updateUploading(bookComponentId, uploading)

      const updatedBookComponent = await BookComponent.findById(bookComponentId)
      const belongingBook = await Book.findById(updatedBookComponent.bookId)

      subscriptionManager.publish(BOOK_COMPONENT_UPLOADING_UPDATED, {
        bookComponentUploadingUpdated: updatedBookComponent.id,
      })

      subscriptionManager.publish(BOOK_UPDATED, {
        bookUpdated: belongingBook.id,
      })

      res.json({ status: 'ok' })
    } catch (error) {
      console.error('Error processing pandoc callback:', error)

      // Try to update the book component status to error
      try {
        const { bookComponentId } = req.body

        if (bookComponentId) {
          const bookComp = await getBookComponent(bookComponentId)
          await updateUploading(bookComponentId, false)
          await setStatus(bookComponentId, STATUSES.CONVERSION_ERROR)

          const belongingBook = await Book.findById(bookComp.bookId)

          subscriptionManager.publish(BOOK_COMPONENT_UPDATED, {
            bookComponentUpdated: bookComponentId,
          })

          subscriptionManager.publish(BOOK_UPDATED, {
            bookUpdated: belongingBook.id,
          })
        }
      } catch (updateError) {
        console.error('Error updating book component status:', updateError)
      }

      res.status(500).json({ error: error.message })
    }
  })

  app.use('/api/xsweet', async (req, res) => {
    try {
      const { body } = req

      const {
        objectId: bookComponentId,
        responseToken,
        convertedContent,
        serviceCallbackTokenId,
        error,
      } = body

      res.status(200).json({
        msg: 'ok',
      })

      if (!convertedContent && error) {
        throw new Error('error in xsweet conversion')
      }

      const { result: serviceCallbackToken } = await ServiceCallbackToken.find({
        id: serviceCallbackTokenId,
        responseToken,
        bookComponentId,
      })

      if (serviceCallbackToken.length !== 1) {
        throw new Error('unknown service token or conflict')
      }

      const contentWithImagesHandled = await xsweetImagesHandler(
        convertedContent,
        bookComponentId,
      )

      const uploading = false
      await updateContent(bookComponentId, contentWithImagesHandled, 'en')

      await updateUploading(bookComponentId, uploading)
      const updatedBookComponent = await BookComponent.findById(bookComponentId)
      const belongingBook = await Book.findById(updatedBookComponent.bookId)
      await ServiceCallbackToken.deleteById(serviceCallbackTokenId)

      subscriptionManager.publish(BOOK_COMPONENT_UPLOADING_UPDATED, {
        bookComponentUploadingUpdated: updatedBookComponent.id,
      })

      subscriptionManager.publish(BOOK_UPDATED, {
        bookUpdated: belongingBook.id,
      })
    } catch (error) {
      const { body } = req

      const { objectId: bookComponentId } = body

      if (!(error instanceof NotFoundError)) {
        const bookComp = await getBookComponent(bookComponentId)
        await updateUploading(bookComponentId, false)
        await setStatus(bookComponentId, STATUSES.CONVERSION_ERROR)

        const belongingBook = await Book.findById(bookComp.bookId)

        subscriptionManager.publish(BOOK_COMPONENT_UPDATED, {
          bookComponentUpdated: bookComponentId,
        })

        subscriptionManager.publish(BOOK_UPDATED, {
          bookUpdated: belongingBook.id,
        })
      }

      // log error
      logger.error(error)
    }
  })
  app.use('/api/fileserver/cleanup/:scope/:hash', async (req, res, next) => {
    const { scope, hash } = req.params
    const filePath = `${tempFolderPath}/${scope}/${hash}`

    try {
      await fs.remove(filePath)
      res.end()
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })
  app.use('/api/fileserver/:scope/:location/:file', async (req, res, next) => {
    const { location, file } = req.params

    try {
      const filePath = `${tempFolderPath}/previewer/${location}/${file}`

      if (fs.existsSync(filePath)) {
        const mimetype = mime.lookup(filePath)
        const fileContent = await readFile(filePath, 'binary')
        res.setHeader('Content-Type', `${mimetype}`)
        res.setHeader('Content-Disposition', `attachment; filename=${file}`)
        res.write(fileContent, 'binary')
        res.end()
      } else {
        throw new Error('file was cleaned')
      }
    } catch (error) {
      res.status(500).json({ error })
    }
  })
  app.post('/api/chapter', async (req, res) => {
    try {
      const { chapterId, lang = 'en' } = req.body

      const chapter = await BookComponentTranslation.query()
        .leftJoin(
          'book_component',
          'book_component.id',
          'book_component_translation.book_component_id',
        )
        .select(
          'book_component.id as chapterId',
          'book_component_translation.title',
          'book_component_translation.content',
          'book_component_translation.languageIso as lang',
        )
        .where({
          'book_component.id': chapterId,
          'book_component_translation.languageIso': lang,
        })

      res.status(200).json({
        chapter,
      })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })
  app.get('/api/chapter/:chapterId', async (req, res) => {
    try {
      const { chapterId, lang = 'en' } = req.params

      const chapter = await BookComponentTranslation.query()
        .leftJoin(
          'book_component',
          'book_component.id',
          'book_component_translation.book_component_id',
        )
        .select(
          'book_component.id as chapterId',
          'book_component_translation.title',
          'book_component_translation.content',
          'book_component_translation.languageIso as lang',
        )
        .where({
          'book_component.id': chapterId,
          'book_component_translation.languageIso': lang,
        })

      res.status(200).json({
        chapter,
      })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })
  app.post('/api/chapter/create', async (req, res) => {
    try {
      const {
        content,
        bookId,
        afterId,
        divisionLabel: label = 'Body',
      } = req.body

      if (!content || !bookId) {
        res.status(500).json({ error: 'Missing content or bookId' })
      }

      const division = await Division.findOne({
        bookId,
        label,
      })

      await createBookComponentWithContent(
        bookId,
        division.id,
        'chapter',
        afterId,
        content,
        {},
      )

      subscriptionManager.publish(BOOK_UPDATED, { bookUpdated: bookId })

      res.status(200).send('Chapter created successfully')
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })
  app.post('/api/part/create', async (req, res) => {
    try {
      const {
        content,
        afterId,
        bookId,
        divisionLabel: label = 'Body',
      } = req.body

      if (!content || !bookId) {
        res.status(500).json({ error: 'Missing content or bookId' })
      }

      const division = await Division.findOne({
        bookId,
        label,
      })

      await createBookComponentWithContent(
        bookId,
        division.id,
        'part',
        afterId,
        content,
        {},
      )

      subscriptionManager.publish(BOOK_UPDATED, { bookUpdated: bookId })

      res.status(200).send('Part created successfully')
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })
  app.post('/api/chapter/update', async (req, res) => {
    await updateBookComponent(req, res)
  })
  app.post('/api/part/update', async (req, res) => {
    await updateBookComponent(req, res)
  })
  app.post('/api/chapter/delete', async (req, res) => {
    try {
      const { chapterId } = req.body

      const component = await BookComponent.findById(chapterId)
      await deleteBookComponent(component)
      subscriptionManager.publish(BOOK_UPDATED, {
        bookUpdated: component.bookId,
      })

      res.status(200).send('Chapter deleted successfully')
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })
  app.post('/api/part/delete', async (req, res) => {
    try {
      const { partId } = req.body

      const component = await BookComponent.findById(partId)
      await deleteBookComponent(component)

      const nestedChapters = await BookComponent.query().where(
        'parent_component_id',
        partId,
      )

      await Promise.all(
        nestedChapters.map(async chapter => {
          await updateBookComponentParentId(chapter.id, null)
        }),
      )
      subscriptionManager.publish(BOOK_UPDATED, {
        bookUpdated: component.bookId,
      })

      res.status(200).send('Part deleted successfully')
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })
  app.get('/api/book/:bookId', async (req, res) => {
    try {
      const { bookId } = req.params
      const { lang = 'en' } = req.query

      const division = await Division.findOne({
        bookId,
        label: 'Body',
      })

      const chaptersContent = await BookComponentTranslation.query()
        .leftJoin(
          'book_component',
          'book_component.id',
          'book_component_translation.book_component_id',
        )
        .select(
          'book_component.id as componentId',
          'book_component.component_type as type',
          'book_component_translation.id as translationId',
          'book_component_translation.title',
          'book_component_translation.content',
          'book_component.division_id as divisionId',
          'book_component_translation.deleted',
          'book_component_translation.language_iso as language',
        )
        .where({
          divisionId: division.id,
          'book_component_translation.deleted': false,
          'book_component_translation.language_iso': lang,
        })

      const order = division.bookComponents

      const profiles = await ExportProfile.find({ bookId, deleted: false })
      const pdfProfiles = profiles.result.filter(p => p.format === 'pdf')
      const epubProfiles = profiles.result.filter(p => p.format === 'epub')

      res.status(200).json({
        bookId,
        chapters: chaptersContent
          .map(
            ({
              title,
              content,
              componentId,
              translationId,
              type,
              language,
            }) => ({
              title,
              content,
              componentId,
              translationId,
              type,
              language,
            }),
          )
          .sort(
            (a, b) =>
              order.indexOf(a.componentId) - order.indexOf(b.componentId),
          ),
        profiles: {
          pdf: pdfProfiles.map(profile => ({
            id: profile.id,
            name: profile.displayName,
            format: profile.format,
          })),
          epub: epubProfiles.map(profile => ({
            id: profile.id,
            name: profile.displayName,
            format: profile.format,
          })),
        },
      })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })
  app.get('/api/book/:bookId/toc', async (req, res) => {
    try {
      const { bookId } = req.params

      const toc = await getBookTOC(bookId)

      res.status(200).json({ toc })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })
  app.post('/api/book/translate', async (req, res) => {
    try {
      const { bookId, languageIso, chapters } = req.body

      await useTransaction(async tr => {
        await Promise.all(
          chapters.map(async ({ title, content, bookComponentId }) => {
            await BookComponentTranslation.insert({
              bookComponentId,
              languageIso,
              title,
              content,
            })
          }),
          { trx: tr },
        )

        subscriptionManager.publish('BOOK_TRANSLATED', { bookId })

        res.status(200).send('Chapters were translated and stored successfully')
      })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })
  app.post('/api/chapter/translate', async (req, res) => {
    try {
      const { chapterId, languageIso, content } = req.body

      const existingTranslation = await BookComponentTranslation.findOne({
        bookComponentId: chapterId,
        languageIso,
      })

      if (!existingTranslation) {
        await BookComponentTranslation.insert({
          bookComponentId: chapterId,
          languageIso,
          content,
        })
      } else {
        await BookComponentTranslation.patchAndFetchById(
          existingTranslation.id,
          {
            content,
          },
        )
      }

      subscriptionManager.publish('BOOK_COMPONENT_TRANSLATED', {
        bookComponentTranslated: chapterId,
      })

      res.status(200).send('Chapter translated successfully')
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })
  app.get('/api/export/:profileId', async (req, res) => {
    try {
      const { profileId } = req.params
      const exportProfile = await ExportProfile.findById(profileId)

      const { bookId, templateId, format, isbn, includedComponents } =
        exportProfile

      const filepath = await exportBook(
        bookId,
        templateId,
        null,
        format,
        null,
        {
          includeTOC: includedComponents.toc,
          includeCopyrights: includedComponents.copyright,
          includeTitlePage: includedComponents.titlePage,
          includeCoverPage: includedComponents.cover,
          isbn,
        },
      )

      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filepath.filename}"`,
      )

      const fileStream = fs.createReadStream(filepath.localPath)
      fileStream.pipe(res)

      fileStream.on('end', () => {
        fs.unlink(filepath.localPath).catch(console.error) // Delete temp file
      })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })
}

module.exports = RESTEndpoints
