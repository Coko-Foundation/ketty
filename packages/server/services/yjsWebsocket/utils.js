/* eslint-disable no-restricted-syntax */
// const pick = require('lodash/pick')
const syncProtocol = require('y-protocols/dist/sync.cjs')
const awarenessProtocol = require('y-protocols/dist/awareness.cjs')
const encoding = require('lib0/encoding')
const decoding = require('lib0/decoding')
const map = require('lib0/map')
const Y = require('yjs')

const { db } = require('@coko/server')

const WSSharedDoc = require('./wsSharedDoc')
const BookComponentTranslation = require('../../models/bookComponentTranslation/bookComponentTranslation.model')
const { getFileURL } = require('../../controllers/file.controller')

let persistence = null

const messageSync = 0
const messageAwareness = 1
const wsReadyStateConnecting = 0
const wsReadyStateOpen = 1
const docs = new Map()

/**
 * @param {Uint8Array} update
 * @param {any} origin
 * @param {WSSharedDoc} doc
 */
const updateHandler = (update, origin, doc) => {
  const encoder = encoding.createEncoder()
  encoding.writeVarUint(encoder, messageSync)
  syncProtocol.writeUpdate(encoder, update)
  const message = encoding.toUint8Array(encoder)
  doc.conns.forEach((_, conn) => send(doc, conn, message))
}

/**
 * @param {WSSharedDoc} doc
 * @param {any} conn
 * @param {Uint8Array} m
 */
const send = (doc, conn, m) => {
  if (
    conn.readyState !== wsReadyStateConnecting &&
    conn.readyState !== wsReadyStateOpen
  ) {
    closeConn(doc, conn)
  }

  try {
    conn.send(
      m,
      /** @param {any} err */ err => {
        err != null && closeConn(doc, conn)
      },
    )
  } catch (e) {
    closeConn(doc, conn)
  }
}

/**
 * @param {WSSharedDoc} doc
 * @param {any} conn
 */
const closeConn = (doc, conn) => {
  if (doc.conns.has(conn)) {
    /**
     * @type {Set<number>}
     */
    // @ts-ignore
    const controlledIds = doc.conns.get(conn)
    doc.conns.delete(conn)
    awarenessProtocol.removeAwarenessStates(
      doc.awareness,
      Array.from(controlledIds),
      null,
    )

    persistence.writeState(doc).catch(err => {
      console.error('Failed to write document state on user disconnect:', err)
    })

    if (doc.conns.size === 0) {
      doc.destroy()
      docs.delete(doc.name)
    }
  }

  conn.close()
}

// const shouldWrite = (docName) => {
//   const now = Date.now();
//   const last = LAST_WRITE.get(docName) || 0;
//   const WRITE_INTERVAL = 10000; // 10 seconds
//   if (now - last > WRITE_INTERVAL) {
//     LAST_WRITE.set(docName, now);
//     return true;
//   }
//   return false;
// }

// match if there are src attributes with '/file/' in them (unmodified image urls)
const regex = /src="[^"]*\/file\/[^"]*"/g

const getYDoc = (docName, userId, extraData) =>
  map.setIfUndefined(docs, docName, () => {
    const doc = new WSSharedDoc(docName, userId, extraData)
    doc.gc = true

    if (persistence !== null) {
      persistence.bindState(docName, doc)
    }

    docs.set(docName, doc)
    return doc
  })

const messageListener = async (conn, doc, message) => {
  try {
    const encoder = encoding.createEncoder()
    const decoder = decoding.createDecoder(message)
    const messageType = decoding.readVarUint(decoder)

    // eslint-disable-next-line default-case
    switch (messageType) {
      case messageSync:
        encoding.writeVarUint(encoder, messageSync)
        syncProtocol.readSyncMessage(decoder, encoder, doc, null)

        if (regex.exec(doc.getXmlFragment('prosemirror').toString())) {
          await replaceImgSrc(doc)
        }

        if (encoding.length(encoder) > 1) {
          send(doc, conn, encoding.toUint8Array(encoder))
        }

        break
      case messageAwareness:
        awarenessProtocol.applyAwarenessUpdate(
          doc.awareness,
          decoding.readVarUint8Array(decoder),
          conn,
        )
        break
    }
  } catch (error) {
    console.error(error)
    doc.emit('error', [error])
  }
}

const replaceImgSrc = async doc => {
  const xmlFragment = doc.getXmlFragment('prosemirror')

  // Traverses children of an xml fragment asynchronously
  const traverseFragment = async fragment => {
    const promises = []

    for (let i = 0; i < fragment.length; i += 1) {
      if (typeof fragment.get === 'function') {
        const node = fragment.get(i)
        promises.push(updateImageSrcs(node))
      }
    }

    await Promise.all(promises)
  }

  // Recursive function to walk the Y.XmlElement tree
  const updateImageSrcs = async node => {
    if (node instanceof Y.XmlElement && node.nodeName === 'image') {
      const fileId = node.getAttribute('fileid')

      if (fileId) {
        const newSrc = await getFileURL(fileId, 'medium')
        node.setAttribute('src', newSrc)
      }
    }

    await traverseFragment(node)
  }

  await traverseFragment(xmlFragment)
}

persistence = {
  bindState: async (id, doc) => {
    const collaborativeForm = await BookComponentTranslation.query().findOne({
      bookComponentId: doc.extraData.bookComponentId,
      languageIso: doc.extraData.language || 'en',
    })

    if (collaborativeForm) {
      const { yState } = collaborativeForm
      const emptyDoc = new Y.Doc()

      if (yState) {
        Y.applyUpdate(emptyDoc, yState)
        await replaceImgSrc(emptyDoc)
        const newState = Y.encodeStateAsUpdate(emptyDoc)

        doc.transact(async () => {
          setTimeout(() => {
            Y.applyUpdate(doc, newState)
          }, 1000)
        })
      }
    }
  },
  writeState: async ydoc => {
    // const objectId = ydoc.name
    const state = Y.encodeStateAsUpdate(ydoc)

    const timestamp = db.fn.now()
    const content = ydoc.getText('html').toString()
    // const base64State = Buffer.from(state).toString('base64')

    if (content.length && ydoc.extraData.objectId && ydoc.extraData.language) {
      await BookComponentTranslation.query()
        .patch({
          yState: state,
          updated: timestamp,
          content,
        })
        .findOne({
          bookComponentId: ydoc.extraData.objectId,
          languageIso: ydoc.extraData.language,
        })
    }
  },
}

module.exports = {
  syncProtocol,
  awarenessProtocol,
  encoding,
  persistence,
  messageSync,
  wsReadyStateConnecting,
  wsReadyStateOpen,
  docs,
  updateHandler,
  decoding,
  send,
  closeConn,
  messageAwareness,
  messageListener,
  getYDoc,
}
