/* stylelint-disable declaration-no-important */
/* eslint-disable react/prop-types */
import React from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@apollo/client'
import {
  GET_DOCUMENTS,
  CREATE_DOCUMENT,
  DELETE_DOCUMENT,
} from '../graphql/knowledgeBase.queries'
import { KnowledgeBase } from '../ui'

export const KnowledgeBasePage = () => {
  const params = useParams()
  const { bookId } = params

  const { data } = useQuery(GET_DOCUMENTS, {
    fetchPolicy: 'network-only',
    variables: {
      bookId,
    },
  })

  const [createDocument] = useMutation(CREATE_DOCUMENT, {
    refetchQueries: [GET_DOCUMENTS],
    onError: console.error,
  })

  const [deleteDocument] = useMutation(DELETE_DOCUMENT, {
    refetchQueries: [GET_DOCUMENTS],
  })

  return (
    <KnowledgeBase
      bookId={bookId}
      createDocument={createDocument}
      deleteDocument={deleteDocument}
      docs={data?.getDocuments}
    />
  )
}

export default KnowledgeBasePage
