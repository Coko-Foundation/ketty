import React from 'react'
import { useHistory } from 'react-router-dom'
import { useMutation, useQuery } from '@apollo/client'
import { useCurrentUser } from '@coko/client'
import { InitBook } from '../ui'
import { CREATE_BOOK, GET_TREE_MANAGER_AND_SHARED_DOCS } from '../graphql'
import { showGenericErrorModal } from '../helpers/commonModals'
import { findFirstDocument } from '../ui/DocTreeManager/utils'

const CreateBook = () => {
  const history = useHistory()
  const { currentUser, setCurrentUser } = useCurrentUser()

  const { loading, data: documents } = useQuery(
    GET_TREE_MANAGER_AND_SHARED_DOCS,
  )

  const [createBook] = useMutation(CREATE_BOOK, {
    onError: () => {
      return showGenericErrorModal()
    },
  })

  const createBookHandler = whereNext => {
    const variables = { input: { addUserToBookTeams: ['owner'] } }

    return createBook({ variables }).then(res => {
      const { data } = res
      const { createBook: createBookData } = data
      const { book: { id, divisions } = {}, newUserTeam } = createBookData

      setCurrentUser({
        ...currentUser,
        teams: [...currentUser.teams, newUserTeam],
      })

      history.push({
        pathname: `/books/${id}/${whereNext}`,
        state: { createdChapterId: divisions[1]?.bookComponents[0]?.id },
      })
    })
  }

  const onCreateBook = () => {
    return createBookHandler('rename')
  }

  const onImportBook = () => {
    return createBookHandler('import')
  }

  if (loading) return null

  const root = JSON.parse(documents.getDocTree)

  console.log(root)
  if (root.length > 0) {
    const firstDocument = findFirstDocument(root)
    console.log(firstDocument)
    if (firstDocument?.bookComponentId) {
      history.push(`/document/${firstDocument?.bookComponentId}`, {
        replace: true,
      })
      return true
    }
  }
  console.log('strart book')

  return <InitBook onCreateBook={onCreateBook} onImportBook={onImportBook} />
}

export default CreateBook
