/* eslint-disable react/prop-types */

import React, { useState } from 'react'
import { WebsocketProvider } from 'y-websocket'
import * as Y from 'yjs'

import { uuid } from '@coko/client'

const DocumentContext = React.createContext({
  title: null,
  updateTitle: () => {},
})

const { Provider, Consumer } = DocumentContext


const DocumentProvider = ({ children }) => {
  const [wsProvider, setWsProvider] = useState(null)
  const [ydoc, setYDoc] = useState(null)

  const createYjsProvider = ({ currentUser, object, identifier }) => {
    if (!object) {
      throw new Error('You need to specify a collaborativeObject')
    }

    if (!identifier) {
      throw new Error('You need to specify a Identifier')
    }

    let ydocInstance = null
    ydocInstance = new Y.Doc()
    setYDoc(ydocInstance)

    let provider = null

    if (!identifier) {
      // eslint-disable-next-line no-param-reassign
      identifier = uuid()
    }

    // eslint-disable-next-line no-restricted-globals
    provider = new WebsocketProvider(
      'ws://localhost:3333',
      identifier,
      ydocInstance,
      {
        params: {
          token: localStorage.getItem('token') || '',
          ...object,
        },
      },
    )

    const color = arrayColor[Math.floor(Math.random() * arrayColor.length)]

    if (currentUser) {
      provider.awareness.setLocalStateField('user', {
        id: currentUser.id || uuid(),
        color,
        displayName: currentUser
          ? currentUser.username || currentUser.email
          : 'Anonymous',
      })
    }

    setWsProvider(provider)
  }

  return (
    <Provider
      value={{
        wsProvider,
        ydoc,
        createYjsProvider,
      }}
    >
      {children}
    </Provider>
  )
}

export { Consumer as DocumentConsumer, DocumentProvider }

export default DocumentContext
