import React from 'react'
import { useHistory } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { useCurrentUser } from '@coko/client'
import { InitBook } from '../ui'
import { CREATE_BOOK } from '../graphql'
import { showGenericErrorModal } from '../helpers/commonModals'

const CreateBook = () => {
  const history = useHistory()
  const { currentUser, setCurrentUser } = useCurrentUser()

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

  return <InitBook onCreateBook={onCreateBook} onImportBook={onImportBook} />
}

export default CreateBook
